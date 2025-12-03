import { StatusCodes } from "http-status-codes";
import { jobModel } from "../../DB/models/job.model.js";
import { checkAccess, checkHR } from "./helpers/checkAccess.js";
import { appModel } from "../../DB/models/application.model.js";
import cloudinary from "../../utils/multer/cloudinary.js";
import { getApp } from "../../socketio/socket.controller.js";
import { pagination } from "../../utils/pagination/pagination.js";
import { template } from "../../utils/sendEmail/html.js";
import { subjects } from "../../utils/globalEnums/enums.js";
import { emailEvent } from "../../utils/sendEmail/sendEmail.js";



export const addJob  =async(req , res , next)=>{
    const user = req.user
    const company = req.company
    const isAllowed = checkAccess(user , company);
    if(!isAllowed)
        return next(new Error('you are not allowed to add job' , {cause:StatusCodes.BAD_REQUEST}));
    const job = await jobModel.create({
        ...req.body , companyId : company._id, addedBy : user._id
    })
    return res.status(StatusCodes.ACCEPTED).json({success:true , job})
}

export const updateJob = async(req , res , next)=>{
    const user = req.user;
    const {jobId} = req.params
    const job = await jobModel.findOne({
        _id : jobId ,
    })
    if(!job)
        return next(new Error('job not found' , {cause :StatusCodes.NOT_FOUND}))

    if(user._id.toString()!== job.addedBy.toString())
        return next(new Error('you are not allowed to edit this job' , {cause:StatusCodes.BAD_REQUEST}));
    job.jobDescription = req.body.jobDescription || job.jobDescription;
    job.jobTitle = req.body.jobTitle || job.jobTitle;
    job.jobLocation = req.body.jobLocation || job.jobLocation
    job.technicalSkills = req.body.technicalSkills || job.technicalSkills
    job.softSkills = req.body.softSkills || job.softSkills
    job.seniorityLevel = req.body.seniorityLevel || job.seniorityLevel
    await job.save();
    return res.status(StatusCodes.ACCEPTED).json({success : true , job})
}

export const getJobsForCompany =async(req , res , next)=>{
    const company = req.company;
    const {page , size} = req.query
    const {skip , limit} = pagination(page , size)
    const jobs = await jobModel.find({
        companyId : company._id,
        deletedAt:null
    }).skip(skip).limit(limit)
    if(!jobs.length)
        return next(new Error('not jobs add in this company yet' , {cause : StatusCodes.BAD_REQUEST}));
    return res.status(StatusCodes.ACCEPTED).json({success:true , jobs})
}


export const jobSearch = async(req , res , next)=>{
    const filter={...req.body};
     const {page , size} = req.query
    const {skip , limit} = pagination(page , size)
    const jobs = await jobModel.find({
        ...filter , 
        deletedAt:null
    }).skip(skip).limit(limit)
        if(!jobs.length)
        return next(new Error('not matched jobs' , {cause : StatusCodes.BAD_REQUEST}));
    return res.status(StatusCodes.ACCEPTED).json({success:true , jobs , result : jobs.length})

}

export const getApplications = async(req , res , next)=>{
    const {jobId} = req.params;
    const user = req.user;
    const company = req.company
    // check if the user is allowed to see applications

    if(!checkAccess(user , company))
        return next(new Error('you are not allowed to see applications'))

    // check if the job is not found


    const job = await jobModel.findOne({
        _id:jobId , companyId : company._id
    }).populate({
        path:'Applications',
        populate:{
            path:'userId',
        }
    })
    if(!job)
        return next(new Error('job not found'))
    return res.status(StatusCodes.ACCEPTED).json({success : true , Applications : job.Applications , job})
}

export const applyJob = async(req , res , next)=>{
    
    const file = req.file;
    if (!file) {
        return next(new Error('CV file is required', { cause: StatusCodes.BAD_REQUEST }));
    }
    
    
    const user = req.user;
    const {jobId} = req.params;
    const company = req.company;
    const job = await jobModel.findOne({
        _id:jobId , closed : false , deletedAt : null
    }).populate({
        path:'Applications',
        populate:{
            path:'userId',
        }
    })
    if(!job)
        return next(new Error('job not found' , {cause :StatusCodes.NOT_FOUND}))
    const isExist = await appModel.findOne({
        jobId , userId:user._id 
    });
    if(isExist)
        return next(new Error('you are already applied to this job' , {cause :StatusCodes.BAD_REQUEST}))
    const {secure_url , public_id} = await cloudinary.uploader.upload(file.path , {
        folder:`users/user/applications/${user._id}/userCV`
    });
    const userCV ={
        secure_url , public_id
    }
    const application = await appModel.create({
        jobId , userId:user._id , userCV
    });
    const HRs = company.HRs.map(HR => HR.toString());
    getApp(HRs , application);
    return res.status(StatusCodes.ACCEPTED).json({success : true , application})
}

export const acceptApp = async(req , res , next)=>{
    const user = req.user;
    const company = req.company;
    const {appId} = req.params
    const app = await appModel.findOne({
        _id : appId
    }).populate([{
        path:'userId'
    }])
    
    if(!app)
        return next(new Error('application not found' , {cause : StatusCodes.NOT_FOUND}));
    
    if(!checkHR(company.HRs , user._id))
        return next(new Error('you are not allowed to accept this application' , {cause : StatusCodes.BAD_REQUEST}));
    app.status = 'ACCEPTED';
    await app.save();
    const html = template(subjects.ACCEPT_APP ,app.userId.userName ,subjects.ACCEPT_APP );
    emailEvent.emit('acceptApp' , {to : app.userId.email  , html});
    return res.status(StatusCodes.ACCEPTED).json({success : true , app})
}


export const rejectApp = async(req , res , next)=>{
    const user = req.user;
    const company = req.company;
    const {appId} = req.params
    const app = await appModel.findOne({
        _id : appId
    }).populate([{
        path:'userId'
    }])
    if(!app)
        return next(new Error('application not found' , {cause : StatusCodes.NOT_FOUND}));
    if(!checkHR(company.HRs , user._id))
        return next(new Error('you are not allowed to reject this application' , {cause : StatusCodes.BAD_REQUEST}));
    app.status = subjects.REJECT_APP;
    await app.save();
    const html = template(subjects.REJECT_APP ,app.userId.userName ,subjects.REJECT_APP );
    emailEvent.emit('rejectApp' , {to : app.userId.email  , html});
    return res.status(StatusCodes.ACCEPTED).json({success : true , app})
}




export const deleteJob = async(req , res , next)=>{
    const user = req.user;
    const company = req.company;
    const {jobId } = req.params;
    const job = await jobModel.findOne({
        companyId : company._id ,_id : jobId
    }).populate({
        path:'Applications'
    })
    
    if(!job)
        return next(new Error('job not found' , {cause : StatusCodes.NOT_FOUND}));
    
    if(!checkHR(company.HRs , user._id) && user._id.toString() !== company.createdBy.toString())
        return next(new Error('you are not allowed to delete this job' , {cause : StatusCodes.BAD_REQUEST}));

    await job.deleteOne()
    return res.status(StatusCodes.ACCEPTED).json({success : true})
}
