import { StatusCodes } from "http-status-codes";
import {  userModel } from "../../DB/models/user.model.js";
import { hash } from "../../utils/hash/hash.js";
import { code } from "../../utils/sendEmail/code.js";
import { template } from "../../utils/sendEmail/html.js";
import { emailEvent} from "../../utils/sendEmail/sendEmail.js";
import { createToken } from "../../utils/token/createToken.js";
import { decodeToken } from "../../utils/token/decodeToken.js";
import { sign } from "../../utils/token/sign.js";
import { OTPTypes, Providers, subjects, tokenTypes } from "../../utils/globalEnums/enums.js";
import { compare } from "../../utils/hash/compare.js";
import { compareOTP } from "./helpers/compareOTP.js";
import { verifyGoogleToken } from "./helpers/verifyGoogleToken.js";

export const register = async(req , res , next)=>{
    const {firstName , lastName  , email , password , phone ,role , DOB , gender} = req.body;
    const isExist = await userModel.findOne({email});
    if(isExist) 
        return next(new Error('Email already exist' , {cause:StatusCodes.BAD_REQUEST}));
    const confirmEmailOTP =await code();
    const html = template(confirmEmailOTP , `${firstName} ${lastName}` , subjects.CONFIRM_EMAIL);
    const user = await userModel.create({
        firstName ,
        lastName ,
        email , 
        role  ,
        DOB,
        gender,
        password : hash(password) ,
        phone,
        OTP:{
            code:hash(confirmEmailOTP),
            OTPType : OTPTypes.CONFIRM_EMAIL
        }
    })
    
    emailEvent.emit('confirmEmail' ,({to : email , html}))
    return res.status(StatusCodes.CREATED).json({success:true , user});
}

export const confirmEmail = async(req , res ,next)=>{
    const {code , email} = req.body;
    const user = await userModel.findOne({email});
    if(!user)  return next(new Error('user not found' , {cause:StatusCodes.NOT_FOUND}));

    const confirmEmailOTP = user.OTP.filter(otp => otp.OTPType === OTPTypes.CONFIRM_EMAIL) ;

    if(!confirmEmailOTP.length) next(new Error('OTP not found' , {cause:StatusCodes.NOT_FOUND}));

    if(!compareOTP(code , confirmEmailOTP))
        return next(new Error('in-correct code' , {cause:StatusCodes.BAD_REQUEST}));
    user.isConfirmed = true;
    user.OTP = user.OTP.filter(OTP => OTP.OTPType !== OTPTypes.CONFIRM_EMAIL && !compare(code , OTP.code));
    await user.save();
    return res.status(StatusCodes.CREATED).json({success:true, user});
}


export const logIn = async(req , res , next)=>{
    const {email , password} = req.body
    const user = await userModel.findOne({email , isConfirmed:true , provider : Providers.SYSTEM , isDeleted : false , deletedAt : null});
    if(!user) 
        return next(new Error('user not found' , {cause:StatusCodes.NOT_FOUND}));
    if(!compare( password , user.password))
        return next(new Error('in-correct email or password' , {cause:StatusCodes.BAD_REQUEST}));  
    const {accessToken , refreshToken} = await createToken(user.role , {id : user._id ,changeCredentialTime : user.changeCredentialTime});
    return res.status(StatusCodes.ACCEPTED).json({success:true,accessToken , refreshToken})
}

export const refreshToken =async(req , res, next)=>{
    const {refreshToken} = req.body;   
    const decodedData = await decodeToken(refreshToken , tokenTypes.REFRESH , next);
    if (!decodedData || !decodedData.user) {
        return next(new Error("Invalid refresh token", { cause: StatusCodes.UNAUTHORIZED }));
    }
    const {user , accessSignature} = decodedData
    const accessToken = await sign({id : user._id , changeCredentialTime : user.changeCredentialTime} , accessSignature)
    return res.status(StatusCodes.ACCEPTED).json({ accessToken});
}
export const resetPassword =async(req , res , next)=>{
    const user = req.user;
    const resetPasswordOTP = await code();
    const html = template(resetPasswordOTP , `${user.firstName} ${user.lastName} ` ,subjects.RESET_PASSWORD);
    emailEvent.emit('resetPassword' , ({to:user.email , html}));
    user.OTP.push({
                OTPType:OTPTypes.FORGET_PASSWORD,
                code:hash(resetPasswordOTP)
    })
    await user.save();
    return res.status(StatusCodes.ACCEPTED).json({success:true ,user})
}

export const changePassword = async(req , res ,next)=>{
    const {code , password} = req.body;
    const user = req.user;
    const resetPasswordOTP = user.OTP.filter(otp => otp.OTPType === OTPTypes.FORGET_PASSWORD);
    if(!resetPasswordOTP.length) return next(new Error('OTP not found' , {cause:StatusCodes.NOT_FOUND}));
    if(!compareOTP(code , resetPasswordOTP ))
        return next(new Error('in-correct code' , {cause:StatusCodes.BAD_REQUEST}));
    user.password = hash(password);
    user.OTP = user.OTP.filter(otp => otp.OTPType !== OTPTypes.FORGET_PASSWORD && !compare(code , otp.code));
    user.changeCredentialTime = Date.now()
    await user.save();
    return res.status(StatusCodes.ACCEPTED).json({message:'password changed' , user})
}


export const socialLogin = async(req , res , next)=>{
    const {idToken} = req.body;
    const payload = await verifyGoogleToken(idToken)
    console.log({payload});
    if(!payload.email_verified) 
        return next(new Error('email not verified' , {cause:StatusCodes.BAD_REQUEST}));
    let user = await userModel.findOne({
        email:payload.email
    });
    if(user?.provider === Providers.SYSTEM)
        return next(new Error('you should login with the system' , {cause:StatusCodes.BAD_REQUEST}));
    if(!user){
        user = await userModel.create({
            firstName:payload.given_name,
            lastName:payload.family_name,
            email:payload.email,
            provider:Providers.GOOGLE,
            isConfirmed:true
        
    });
    }
    const {accessToken , refreshToken} = await createToken(user.role , {id : user._id ,changeCredentialTime : user.changeCredentialTime});
    return res.status(StatusCodes.ACCEPTED).json({success:true,accessToken , refreshToken })
}