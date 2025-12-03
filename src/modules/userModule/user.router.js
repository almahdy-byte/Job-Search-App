import { Router } from "express";
import { auth } from "../../middleWare/auth.middleWare.js";
import { validation } from "../../middleWare/validation.middleWare.js";
import { getAndDeleteUserValidationSchema, profileValidationSchema, updatePasswordValidationSchema, updateUserValidationSchema, uploadPictureValidationSchema } from "./user.validation.js";
import { asyncErrorHandler } from "../../utils/errorHandlers/asyncErrorHandler.js";
import * as userServices from './user.controller.js';
import { uploadFile } from "../../utils/multer/uploadFile.js";
import { FileType } from "../../utils/globalEnums/enums.js";
const router = Router();
router.route('/')
    .get(
        auth(), 
        validation(profileValidationSchema),
        asyncErrorHandler(userServices.getProfile)
    )
    .patch(
        auth() , 
        validation(updateUserValidationSchema) , 
        asyncErrorHandler(userServices.updateUser)
    )
router.route('/profile-pic')
    .post(
        auth(),
        uploadFile(FileType.IMAGE).single("image"),
        validation(uploadPictureValidationSchema),
        asyncErrorHandler(userServices.uploadProfilePic)
    )
    .delete(
        auth(),
        validation(uploadPictureValidationSchema),
        asyncErrorHandler(userServices.deleteProfilePic)
    )
router.route('/cover-pic')
    .post(
        auth(),
        uploadFile(FileType.IMAGE).single("image"),
        validation(uploadPictureValidationSchema),
        asyncErrorHandler(userServices.uploadCovePic)
    )
    .delete(
        auth(),
        validation(uploadPictureValidationSchema),
        asyncErrorHandler(userServices.deleteCoverPic)
    )
router.route('/:userId')
    .delete(
        auth(),
        validation(getAndDeleteUserValidationSchema),
        asyncErrorHandler(userServices.softDelete)
    )
    .get(
        auth() ,
        validation(getAndDeleteUserValidationSchema),
        asyncErrorHandler(userServices.getUser)
    );
router.patch('/update-password' ,
    auth() , 
    validation(updatePasswordValidationSchema) , 
    asyncErrorHandler(userServices.upDatePassword)
)

export default router;
