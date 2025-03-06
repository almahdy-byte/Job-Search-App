import { Router } from "express";
import { auth } from "../../middleWare/auth.middleWare.js";
import { validation } from "../../middleWare/validation.middleWare.js";
import { getAndDeleteUserValidationSchema, updatePasswordValidationSchema, updateUserValidationSchema } from "./user.validation.js";
import { asyncErrorHandler } from "../../utils/errorHandlers/asyncErrorHandler.js";
import * as userServices from './user.controller.js';
import { uploadFile } from "../../utils/multer/uploadFile.js";
import { FileType } from "../../utils/globalEnums/enums.js";
const router = Router();
router.route('/')
    .get(
    auth() , 
    asyncErrorHandler(userServices.getProfile))
    .patch(
    auth() , 
    validation(updateUserValidationSchema) , 
    asyncErrorHandler(userServices.updateUser))
router.delete('/:userId' ,
    auth(),
    validation(getAndDeleteUserValidationSchema),
    asyncErrorHandler(userServices.softDelete))
router.get('/:userId' , 
    auth() ,
    validation(getAndDeleteUserValidationSchema),
    asyncErrorHandler(userServices.getUser))
router.patch('/update-password' ,
    auth() , 
    validation(updatePasswordValidationSchema) , 
    asyncErrorHandler(userServices.upDatePassword))
router.post('/upload-profilePic' , 
    auth(),
    uploadFile(FileType.IMAGE).single("image"),
    asyncErrorHandler(userServices.uploadProfilePic)
)
router.post('/upload-coverPic' , 
    auth(),
    uploadFile(FileType.IMAGE).single("image"),
    asyncErrorHandler(userServices.uploadCovePic)
)
router.delete('/delete-profilePic' , 
    auth(),
    asyncErrorHandler(userServices.deleteProfilePic)
)
router.delete('/delete-coverPic' , 
    auth(),
    asyncErrorHandler(userServices.deleteCoverPic)
)
export default router;
