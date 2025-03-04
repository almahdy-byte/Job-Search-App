import { StatusCodes } from "http-status-codes";
import { jobModel } from "../../DB/models/job.model.js";
import { checkAccess } from "./helpers/checkAccess.js";
import { companyModel } from "../../DB/models/company.model.js";
import { appModel } from "../../DB/models/application.model.js";



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
    const jobs = await jobModel.find({
        companyId : company._id,
        deletedAt:null
    })
    if(!jobs.length)
        return next(new Error('not jobs add in this company yet' , {cause : StatusCodes.BAD_REQUEST}));
    return res.status(StatusCodes.ACCEPTED).json({success:true , jobs})
}


export const jobSearch = async(req , res , next)=>{
    const filter={...req.body};
    const jobs = await jobModel.find({
        ...filter , deletedAt : null
    })
        if(!jobs.length)
        return next(new Error('not matched jobs' , {cause : StatusCodes.BAD_REQUEST}));
    return res.status(StatusCodes.ACCEPTED).json({success:true , jobs})

}

export const getApplications = async(req , res , next)=>{
    const {jobId} = req.params;
    const user = req.user;
    const company = req.company
    if(!checkAccess(user , company))
        return next(new Error('you are not allowed to see applications'))

    


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