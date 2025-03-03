import { StatusCodes } from "http-status-codes";
import { encrypt } from "../../utils/crypt/encrypt.js";
import { userModel } from "../../DB/models/user.model.js";
import { compare } from "../../utils/hash/compare.js";
import { hash } from "../../utils/hash/hash.js";
import cloudinary from "../../utils/multer/cloudinary.js";

export const updateUser = async(req , res , next)=>{
    const user = req.user;
    const {firstName , lastName , phone , DOB , gender} = req.body;
    if(Object.keys(req.body).length === 0) return next(new Error('no data to update' , {cause:StatusCodes.BAD_REQUEST}));   
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.gender = gender || user.gender;
    user.DOB = DOB || user.DOB;
    if(phone) user.phone = phone;
    await user.save();
    return res.status(StatusCodes.ACCEPTED).json({success:true , user});
}

export const getProfile = async(req , res , next)=>{
    const user = req.user;
    return res.status(StatusCodes.OK).json({success:true , user});
}
export const getUser = async(req , res ,next)=>{
    const {userId} = req.params;
    if(userId.toString() === req.user._id.toString()) return res.status(StatusCodes.OK).json({success:true , user:req.user});
    if(!userId) return next(new Error('userId not found' , {cause:StatusCodes.NOT_FOUND}));
    const user = await userModel
    .findOne({_id : userId , isConfirmed:true , deletedAt:null , isDeleted : false})
    .select('firstName lastName phone profilePic coverPic')
    if(!user) return next(new Error('user not found' , {cause:StatusCodes.NOT_FOUND}));
    return res.status(StatusCodes.OK).json({success:true , user});
}
export const upDatePassword = async(req , res ,next)=>{
    const user = req.user;
    const {oldPassword , newPassword} = req.body;
    if(!compare(oldPassword , user.password)) return next(new Error('in-correct old password' , {cause:StatusCodes.BAD_REQUEST}));
    user.password = hash(newPassword);
    user.changeCredentialTime = Date.now();
    await user.save();
    return res.status(StatusCodes.ACCEPTED).json({success : true , user});
}


export const uploadProfilePic = async(req , res ,next)=>{
const file = req.file
const user = req.user
if(Object.values(user.profilePic).length){
    await cloudinary.uploader.destroy(user.profilePic.public_id)
}
const{secure_url , public_id} = await cloudinary.uploader.upload(file.path , {
    folder : `users/user/${user._id}/profilePic`
});

user.profilePic = {
    secure_url , public_id
};
await user.save();
return res.status(StatusCodes.ACCEPTED).json({success:true , user})

}

export const uploadCovePic = async(req , res ,next)=>{
    const file = req.file
    const user = req.user
    if(Object.values(user.coverPic).length){
        await cloudinary.uploader.destroy(user.coverPic.public_id)
    }
    const{secure_url , public_id} = await cloudinary.uploader.upload(file.path , {
        folder : `users/user/${user._id}/coverPic`
    });
    
    user.coverPic = {
        secure_url , public_id
    };
    await user.save();
    return res.status(StatusCodes.ACCEPTED).json({success:true , user})
    }

export const deleteProfilePic = async(req , res ,next)=>{
    const user = req.user
    if(!Object.values(user.profilePic).length) return next(new Error('profile picture not found' ,{cause:StatusCodes.NOT_FOUND}));
    await cloudinary.uploader.destroy(user.profilePic.public_id);
    user.profilePic = {
            secure_url : undefined ,
            public_id : undefined
    };
    await user.save();
    return res.status(StatusCodes.ACCEPTED).json({success:true , user})
}

export const deleteCoverPic = async(req , res ,next)=>{
    const user = req.user
    if(!Object.values(user.coverPic).length) return next(new Error('profile picture not found' ,{cause:StatusCodes.NOT_FOUND}));
    await cloudinary.uploader.destroy(user.coverPic.public_id);
    user.coverPic = {
            secure_url : undefined ,
            public_id : undefined
    };
    await user.save();
    return res.status(StatusCodes.ACCEPTED).json({success:true , user})
}

export const softDelete = async(req , res , next)=>{
const user = req.user;
user.isDeleted = true ;
user.deletedAt = Date.now()
await user.save();
return res.status(StatusCodes.ACCEPTED).json({success : true , user})
}