import { Router } from "express";
import {validation} from '../../middleWare/validation.middleWare.js' 
import { changeEmailValidationSchema, changePasswordValidationSchema, confirmEmailValidationSchema, loginValidationSchema, refreshTokenValidationSchema, registerValidationSchema, resetEmailValidationSchema, socialLoginValidationSchema } from "./auth.validation.js";
import * as authServices from './auth.controller.js'
import { asyncErrorHandler } from "../../utils/errorHandlers/asyncErrorHandler.js";
import { auth } from "../../middleWare/auth.middleWare.js";
const router = Router();


router.get('/' , (req , res  , next)=>{
    return res.json({message:'auth router'})
})

router.post('/register',
    validation(registerValidationSchema) , 
    asyncErrorHandler(authServices.register))
router.patch('/confirm-email',
    validation(confirmEmailValidationSchema) , 
    asyncErrorHandler(authServices.confirmEmail))
router.post('/log-in',
    validation(loginValidationSchema) , 
    asyncErrorHandler(authServices.logIn))
router.post('/social-login',
    validation(socialLoginValidationSchema),
    asyncErrorHandler(authServices.socialLogin)
)
router.post('/refresh-token',
    validation(refreshTokenValidationSchema),
    asyncErrorHandler(authServices.refreshToken))
router.get('/profile',
    auth(),
    asyncErrorHandler(authServices.getProfile))
router.patch('/reset-password',
    auth(),
    asyncErrorHandler(authServices.resetPassword))
router.patch('/change-password',
    auth(), 
    validation(changePasswordValidationSchema),
    asyncErrorHandler(authServices.changePassword))
router.patch('/reset-email',
    auth(),
    validation(resetEmailValidationSchema),
    asyncErrorHandler(authServices.resetEmail))
router.patch('/change-email',
    auth(),
    validation(changeEmailValidationSchema),
    asyncErrorHandler(authServices.changeEmail))
export default router