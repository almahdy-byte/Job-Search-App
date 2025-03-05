import { auth } from "../../middleWare/auth.middleWare.js";
import { validation } from "../../middleWare/validation.middleWare.js";
import { asyncErrorHandler } from "../../utils/errorHandlers/asyncErrorHandler.js";
import { FileType } from "../../utils/globalEnums/enums.js";
import { uploadFile } from "../../utils/multer/uploadFile.js";
import * as companyServices from './company.controller.js'
import { createCompanyValidationSchema, getCompanyAndRElatedJobsValidationSchema, updateCompanyValidationSchema } from "./company.validation.js";
import { Router } from "express";
import jobRouter from '../jobModule/job.router.js'
const router = Router({mergeParams : true});

router.use('/:companyName/job' , jobRouter)
router.post('/',
    auth(),
    validation(createCompanyValidationSchema),
    asyncErrorHandler(companyServices.addCompany)
)
router.patch('/:companyId' , 
    auth(),
    validation(updateCompanyValidationSchema),
    asyncErrorHandler(companyServices.updateCompany)
)
router.get('/:companyName' ,
    auth(),
    asyncErrorHandler(companyServices.getCompanyWithName)
)
router.get('/get-company-relatedJobs/:companyId' ,
    auth(),
    validation(getCompanyAndRElatedJobsValidationSchema),
    asyncErrorHandler(companyServices.getCompanyAndRelatedJobs)
)
router.post('/upload-logo/:companyId' , 
    auth(),
    uploadFile(FileType.IMAGE).single('image'),
    asyncErrorHandler(companyServices.uploadLogo)
)
router.post('/upload-coverPic/:companyId' , 
    auth(),
    uploadFile(FileType.IMAGE).single('image'),
    asyncErrorHandler(companyServices.uploadCovePic)
)
router.delete('/delete-logo/:companyId',
    auth(),
    asyncErrorHandler(companyServices.deleteLogo)
)
router.delete('/delete-coverPic/:companyId',
    auth(),
    asyncErrorHandler(companyServices.deleteCoverPic)
)

router.delete('/:companyId' , 
    auth(),
    asyncErrorHandler(companyServices.softDeleteCompany)
)
export default router;
