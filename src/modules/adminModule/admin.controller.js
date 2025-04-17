import { StatusCodes } from "http-status-codes";
import { userModel } from "../../DB/models/user.model.js";
import { companyModel } from "../../DB/models/company.model.js";

// ban or unban user        
export const banOrUnBanUser =async(req , res , next)=>{
    const {userId} = req.params;
    // check if the target user is not found
    const targetUser = await userModel.findOne({
        _id: userId,
        isDeleted:false , 
        deletedAt : null , 
    })
    // check if the target user is not found
    if(!targetUser) return next(new Error('user not found' , {cause:StatusCodes.NOT_FOUND}));
    // check if the target user is banned
    if(!targetUser.bannedAt){
        // update target user bannedBy to user._id
        targetUser.bannedBy = req.user._id;
        // update target user bannedAt to current date
        targetUser.bannedAt = Date.now();
    }else{
        // update target user bannedBy to null
        targetUser.bannedBy = null;
        // update target user bannedAt to null
        targetUser.bannedAt = null;
    }
    // save target user
    await targetUser.save();
    return res.status(StatusCodes.ACCEPTED).json({success : true , user : targetUser})
}

// ban or unban company
export const banOrUnBanCompany =async(req , res , next)=>{
    const {companyId} = req.params;
    // check if the target company is not found
    const targetCompany = await companyModel.findOne({
        _id: companyId, 
        deletedAt : null , 
    })
    
    if(!targetCompany) 
        return next(new Error('company not found' , {cause:StatusCodes.NOT_FOUND}));
    // check if the target company is banned
    if(!targetCompany.bannedAt){
        // update target company bannedAt to current date
        targetCompany.bannedAt = Date.now();
    }else{
        // update target company bannedAt to null
        targetCompany.bannedAt = null;
    }
    // save target company
    await targetCompany.save();
    return res.status(StatusCodes.ACCEPTED).json({success : true , company : targetCompany})
}

export const approveCompany = async(req , res , next)=>{
    const {companyId} = req.params;
    // check if the target company is not found 
    const company = await companyModel.findOne({
        _id: companyId, 
        deletedAt : null , 
        bannedAt : null
    })
    // check if the target company is not found
    if(!company)
        return next(new Error('company not found' , {cause:StatusCodes.NOT_FOUND}));
    // check if the target company is already approved
    if(company.approvedByAdmin) 
        return next(new Error('company already approved' , {cause:StatusCodes.BAD_REQUEST}));
    // update target company approvedByAdmin to true
    company.approvedByAdmin = true;
    // save target company
    await company.save();
    return res.status(StatusCodes.ACCEPTED).json({success : true , company})
}