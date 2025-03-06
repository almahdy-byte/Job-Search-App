import { StatusCodes } from "http-status-codes";
import { userModel } from "../../DB/models/user.model.js";
import { companyModel } from "../../DB/models/company.model.js";

export const banOrUnBanUser =async(req , res , next)=>{
    const {userId} = req.params;
    
    const targetUser = await userModel.findOne({
        _id: userId,
        isDeleted:false , 
        deletedAt : null , 
    })
    
    if(!targetUser) return next(new Error('user not found' , {cause:StatusCodes.NOT_FOUND}));
    if(targetUser.bannedAt===null){
        targetUser.bannedBy = req.user._id;
        targetUser.bannedAt = Date.now();
    }else{
        targetUser.bannedBy = null;
        targetUser.bannedAt = null;
    }
    await targetUser.save();
    return res.status(StatusCodes.ACCEPTED).json({success : true , user : targetUser})
}


export const banOrUnBanCompany =async(req , res , next)=>{
    const {companyId} = req.params;
    
    const targetCompany = await companyModel.findOne({
        _id: companyId,
        isDeleted:false , 
        deletedAt : null , 
    })
    
    if(!targetCompany) return next(new Error('company not found' , {cause:StatusCodes.NOT_FOUND}));
    if(targetCompany.bannedAt===null){
        targetCompany.bannedAt = Date.now();
    }else{
        targetCompany.bannedAt = null;
    }
    await targetUser.save();
    return res.status(StatusCodes.ACCEPTED).json({success : true , company : targetCompany})
}

export const approveCompany = async(req , res , next)=>{
    const {companyId} = req.params;
    
    const company = await companyModel.findOne({
        _id: companyId, 
        deletedAt : null , 
        bannedAt : null
    })
    if(!company)
        return next(new Error('company not found' , {cause:StatusCodes.NOT_FOUND}));
    if(company.approvedByAdmin)
        return next(new Error('company already approved' , {cause:StatusCodes.BAD_REQUEST}));
    company.approvedByAdmin = true;
    await company.save();
    return res.status(StatusCodes.ACCEPTED).json({success : true , company})
}