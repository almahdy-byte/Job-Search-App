import { StatusCodes } from "http-status-codes";
import { companyModel } from "../../DB/models/company.model.js";
import { userModel } from "../../DB/models/user.model.js";
import cloudinary from "../../utils/multer/cloudinary.js";
import { Roles } from "../../utils/globalEnums/enums.js";

export const addCompany = async(req , res , next)=>{
    const user = req.user;
    const { companyEmail , companyName  , HRs} = req.body;
    let isExist = await companyModel.findOne({
        companyEmail
    });
    if(isExist)
        return next(new Error('company Email already exist' , {cause : StatusCodes.BAD_REQUEST}));
    isExist = await companyModel.findOne({
        companyName
    });
    if(isExist)
        return next(new Error('company name already used' , {cause : StatusCodes.BAD_REQUEST}));
    user.isOwner = true;
    if(Array.isArray(HRs) && HRs.length){
        for (let HR of HRs) {
            let findHR = await userModel.findOne({
                _id : HR , deletedAt : null , bannedAt : null
            })
            if(!findHR)
                return next(new Error('HR account not found' , {cause : StatusCodes.NOT_FOUND}))
            findHR.isHr = true;
            await findHR.save()
        }
    }
    const result = await Promise.all([
        companyModel.create({
        ...req.body , createdBy : user._id
        })
        , user.save()])

    return res.status(StatusCodes.ACCEPTED).json({success:true , company:result[0]})
}

export const updateCompany =async(req , res , next)=>{
    const user = req.user;
    const {companyId} = req.params;
    const {HRs} = req.body
    const company = await companyModel.findOne({
        _id : companyId,
        bannedAt : null
    })
    if(!company)
        return next(new Error('company not found' , {cause : StatusCodes.NOT_FOUND}));
    if(company.createdBy.toString() !== user._id.toString())
        return next(new Error('you are not allowed to update this company information' , {cause: StatusCodes.BAD_REQUEST}));
    if(req.body.legalAttachment){
        return next(new Error('legal attachment can not be updated' , {cause: StatusCodes.BAD_REQUEST}));
    }
    company.address = req.body.address || company.address;
    company.description = req.body.description || company.description;
    company.industry = req.body.industry || company.industry;
    company.numberOfEmployees = req.body.numberOfEmployees || company.numberOfEmployees;
    if(Array.isArray(HRs) && HRs.length){
        const companyHRs = company.HRs.map(hr => hr.toString())
        for (let HR of HRs) {
            let findHR = await userModel.findOne({
                _id : HR , deletedAt : null , bannedAt : null
            })
            if(!findHR)
                return next(new Error('HR account not found' , {cause : StatusCodes.NOT_FOUND}))
            if(companyHRs.find(e=> e === HR.toString()))
                return next(new Error('HR works in your company' , {cause : StatusCodes.NOT_FOUND}))
            company.HRs.push(HR)
            findHR.isHr = true;
            await findHR.save()
        }
    }
    if(req.body.companyEmail){
        let isExist = await companyModel.findOne({
            companyEmail:req.body.companyEmail
        });
        if(isExist)
            return next(new Error('company Email already exist' , {cause : StatusCodes.BAD_REQUEST}));
        company.companyEmail = req.body.companyEmail
    }

    if(req.body.companyName){
        let isExist = await companyModel.findOne({
            companyName:req.body.companyName
        });
        if(isExist)
            return next(new Error('company name already exist' , {cause : StatusCodes.BAD_REQUEST}));
        company.companyName = req.body.companyName
    }
    if(req.body.createdBy){
        const targetUser = await userModel.findOne({
            _id : req.body.createdBy,
            isConfirmed : true,
            deletedAt : null
        });
        if(!targetUser)
            return next(new Error('user not found' , {cause : StatusCodes.NOT_FOUND}));
        company.createdBy = targetUser._id
    }
    await company.save();
    return res.status(StatusCodes.ACCEPTED).json({success : true , company})
}

export const getCompanyWithName = async(req , res ,next)=>{
    const {companyName} = req.params
    const company = await companyModel.findOne({
        companyName
    })
    if(!company)
        return next(new Error('company not found ' , {cause : StatusCodes.NOT_FOUND}));
    return res.status(StatusCodes.ACCEPTED).json({success:true , company})
}

export const getCompanyAndRelatedJobs = async(req , res , next)=>{
    const {companyId} = req.params;
    const company = await companyModel.findOne({
        _id : companyId , deletedAt : null , bannedAt : null
    }).populate('Jobs')
    if(!company)
        return next(new Error('company not found' , {cause : StatusCodes.NOT_FOUND}));
    company.populate({
        path:'Jobs'
    })
    return res.status(StatusCodes.ACCEPTED).json({success : true , company})
}



export const uploadLogo = async(req , res ,next)=>{
const file = req.file
const user = req.user
if (!file) {
    return next(new Error('image is required', { cause: StatusCodes.BAD_REQUEST }));
}
const {companyId} = req.params

const company = await companyModel.findOne({
    _id : companyId , deletedAt : null , bannedAt : null
})
if(!company)
    return next(new Error('company not found ' , {cause : StatusCodes.NOT_FOUND}));

if(user._id.toString() !== company.createdBy.toString())
    return next(new Error('you not allowed to edit this company logo' , {cause : StatusCodes.BAD_REQUEST}));
const{secure_url , public_id} = await cloudinary.uploader.upload(file.path , {
    folder : `companies/company/${company.companyName}/logo`
});

company.logo = {
    secure_url , public_id
};
await company.save();
return res.status(StatusCodes.ACCEPTED).json({success:true , company})

}

export const uploadCovePic = async(req , res ,next)=>{
    const file = req.file
    const user = req.user
    if (!file) {
        return next(new Error('image is required', { cause: StatusCodes.BAD_REQUEST }));
    }
    const {companyId} = req.params
    const company = await companyModel.findOne({
        _id : companyId , deletedAt : null , bannedAt : null
    })
    if(!company)
        return next(new Error('company not found ' , {cause : StatusCodes.NOT_FOUND}));
    if(user._id.toString()!==company.createdBy.toString())
        return next(new Error('you not allowed to edit this company cover picture' , {cause : StatusCodes.BAD_REQUEST}));
    const{secure_url , public_id} = await cloudinary.uploader.upload(file.path , {
        folder : `companies/company/${company.companyName}/coverPic`
    });
    
    company.coverPic = {
        secure_url , public_id
    };
    await company.save();
    return res.status(StatusCodes.ACCEPTED).json({success:true , company})
    
    }

export const deleteLogo = async(req , res ,next)=>{
    const user = req.user
    const {companyId} = req.params
    const company = await companyModel.findOne({
        _id : companyId , deletedAt : null , bannedAt : null
    })

    if(!company)
        return next(new Error('company not found ' , {cause : StatusCodes.NOT_FOUND}));

    if(user._id.toString()!==company.createdBy.toString())
        return next(new Error('you not allowed to edit this company cover picture' , {cause : StatusCodes.BAD_REQUEST}));

    if(!Object.values(company.logo).length) 
        return next(new Error('profile picture not found' ,{cause:StatusCodes.NOT_FOUND}));

    await cloudinary.uploader.destroy(company.logo.public_id);
    company.logo = {
            secure_url : undefined ,
            public_id : undefined
    };
    await company.save();
    return res.status(StatusCodes.ACCEPTED).json({success:true , company})
}

export const deleteCoverPic = async(req , res ,next)=>{
    const user = req.user
    const {companyId} = req.params
    const company = await companyModel.findOne({
        _id : companyId , deletedAt : null , bannedAt : null
    })

    if(!company)
        return next(new Error('company not found ' , {cause : StatusCodes.NOT_FOUND}));

    if(user._id.toString()!==company.createdBy.toString())
        return next(new Error('you not allowed to edit this company cover picture' , {cause : StatusCodes.BAD_REQUEST}));

    if(!Object.values(company.coverPic).length) 
        return next(new Error('profile picture not found' ,{cause:StatusCodes.NOT_FOUND}));

    await cloudinary.uploader.destroy(company.coverPic.public_id);
    company.coverPic = {
            secure_url : undefined ,
            public_id : undefined
    };
    await company.save();
    return res.status(StatusCodes.ACCEPTED).json({success:true , company})
}


export const softDeleteCompany = async(req , res , next)=>{
    const user = req.user;
    const {companyId} = req.params
    const company = await companyModel.findOne({
        _id : companyId , deletedAt : null , bannedAt : null
    }).populate([
        {
            path: 'Jobs',
            populate:{
                path:"Applications"
            }
        },
        {
            path:'HRs'
        }
    ])
    if(!company.createdBy.toString()!==user._id.toString() && user.role !== Roles.ADMIN)
        return next('you are not allowed to delete this job')
    if(company.HRs.length){
        for (const HR of HRs) {
            HR.deletedAt = Date.now()
            await HR.save();
        }
    }

    if(company.Jobs.length){
        for (const job of Jobs) {
            if (job.Applications && job.Applications.length) {
                for (const app of job.Applications) {
                    app.deleteAt  = Date.now();
                    await app.save()
                }
                }
            job.deletedAt = Date.now()
            await job.save();
        }
    }

    company.deletedAt = Date.now();
    return res.status(StatusCodes.ACCEPTED).json({company})
}