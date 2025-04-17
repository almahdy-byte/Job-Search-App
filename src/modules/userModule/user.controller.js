import { StatusCodes } from "http-status-codes";
import { userModel } from "../../DB/models/user.model.js";
import { compare } from "../../utils/hash/compare.js";
import { hash } from "../../utils/hash/hash.js";
import cloudinary from "../../utils/multer/cloudinary.js";
import { Roles } from "../../utils/globalEnums/enums.js";

// update user
export const updateUser = async(req , res , next)=>{
    const user = req.user;
    const {firstName , lastName , phone , DOB , gender} = req.body;
    // check if there is no data to update
    if(Object.keys(req.body).length === 0)
         return next(new Error('no data to update' , {cause:StatusCodes.BAD_REQUEST}));   
    // update user firstName
    user.firstName = firstName || user.firstName;
    // update user lastName
    user.lastName = lastName || user.lastName;
    // update user gender
    user.gender = gender || user.gender;
    // update user DOB
    user.DOB = DOB || user.DOB;
    // update user phone
    if(phone) user.phone = phone;
    // update user updatedBy
    user.updatedBy = user._id;
    // save user
    await user.save();
    return res.status(StatusCodes.ACCEPTED).json({success:true , user});
}

// get profile
export const getProfile = async(req , res , next)=>{
    const user = req.user;
    return res.status(StatusCodes.OK).json({success:true , user});
}

// get user
export const getUser = async(req , res ,next)=>{
    const {userId} = req.params;
    // check if the user is the same user
    if(userId.toString() === req.user._id.toString()){
        const {userName , profilePic , coverPic , phone} = req.user
         return res.status(StatusCodes.OK).json({success:true , user:{userName , profilePic , coverPic , phone}});}
    // check if the userId is not found
    if(!userId) 
        return next(new Error('userId not found' , {cause:StatusCodes.NOT_FOUND}));
    // get user
    const user = await userModel
    .findOne({_id : userId , isConfirmed:true , deletedAt:null , isDeleted : false})
    // check if the user is not found
    if(!user) return next(new Error('user not found' , {cause:StatusCodes.NOT_FOUND}));
    // get user data
    const {userName , profilePic , coverPic , phone} = user
    return res.status(StatusCodes.OK).json({success:true , user:{
        userName , profilePic , coverPic , phone
    }});
}

// update password
export const upDatePassword = async(req , res ,next)=>{
    const user = req.user;
    const {oldPassword , newPassword} = req.body;
    // check if the old password is incorrect
    if(!compare(oldPassword , user.password)) return next(new Error('in-correct old password' , {cause:StatusCodes.BAD_REQUEST}));
    // update user password
    user.password = hash(newPassword);
    // update user changeCredentialTime
    user.changeCredentialTime = Date.now();
    // save user
    await user.save();
    return res.status(StatusCodes.ACCEPTED).json({success : true , user});
}

// upload profile picture
export const uploadProfilePic = async(req , res ,next)=>{
const file = req.file
const user = req.user
// check if the file is not found
if (!file) {
    return next(new Error('image is required', { cause: StatusCodes.BAD_REQUEST }));
}
// upload profile picture to cloudinary
const{secure_url , public_id} = await cloudinary.uploader.upload(file.path , {
    folder : `users/user/${user._id}/profilePic`
});
// update user profile picture
user.profilePic = {
    secure_url , public_id
};
// save user
await user.save();
return res.status(StatusCodes.ACCEPTED).json({success:true , user})

}

// upload cover picture
export const uploadCovePic = async(req , res ,next)=>{
    const file = req.file
    const user = req.user
    // check if the file is not found
    if (!file) {
        return next(new Error('image is required', { cause: StatusCodes.BAD_REQUEST }));
    }
    // upload cover picture to cloudinary   
    const{secure_url , public_id} = await cloudinary.uploader.upload(file.path , {
        folder : `users/user/${user._id}/coverPic`
    });
    // update user cover picture
    user.coverPic = {
        secure_url , public_id
    };
    // save user
    await user.save();
    return res.status(StatusCodes.ACCEPTED).json({success:true , user})
    }

// delete profile picture
export const deleteProfilePic = async(req , res ,next)=>{
    const user = req.user
    // check if the profile picture is not found
    if(!Object.values(user.profilePic).length)
         return next(new Error('profile picture not found' ,{cause:StatusCodes.NOT_FOUND}));
    
    // delete profile picture from cloudinary
    await cloudinary.uploader.destroy(user.profilePic.public_id);
    // update user profile picture
    user.profilePic = {
            secure_url : undefined ,
            public_id : undefined
    };
    // save user
    await user.save();
    return res.status(StatusCodes.ACCEPTED).json({success:true , user})
}

// delete cover picture
export const deleteCoverPic = async(req , res ,next)=>{
    const user = req.user
    // check if the cover picture is not found
    if(!Object.values(user.coverPic).length) 
        return next(new Error('profile picture not found' ,{cause:StatusCodes.NOT_FOUND}));
    // delete cover picture from cloudinary
    await cloudinary.uploader.destroy(user.coverPic.public_id);
    // update user cover picture
    user.coverPic = {
            secure_url : undefined ,
            public_id : undefined
        };
    // save user
    await user.save();
    return res.status(StatusCodes.ACCEPTED).json({success:true , user})
}

// soft delete user
export const softDelete = async(req , res , next)=>{
const {userId} = req.params;
const user = req.user;
const targetUser = await userModel.findOne({
    _id : userId,
    isDeleted : false,
    deletedAt : null ,
})
// check if the target user is not found
if(!targetUser) 
    return next(new Error('user not found' , {cause:StatusCodes.NOT_FOUND}))
// check if the user is not allowed to delete the target user
if(userId.toString() !== user._id.toString() && user.role !== Roles.ADMIN )
    return next(new Error('you are not allowed to delete this user'))
// update target user isDeleted to true
targetUser.isDeleted = true ;
// update target user deletedAt to current date
targetUser.deletedAt = Date.now()
// update target user deletedBy to user._id
targetUser.deletedBy = user._id;
// save target user
await targetUser.save();
return res.status(StatusCodes.ACCEPTED).json({success : true , user : targetUser})
}