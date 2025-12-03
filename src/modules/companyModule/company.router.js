import { auth } from "../../middleWare/auth.middleWare.js";
import { validation } from "../../middleWare/validation.middleWare.js";
import { asyncErrorHandler } from "../../utils/errorHandlers/asyncErrorHandler.js";
import { FileType } from "../../utils/globalEnums/enums.js";
import { uploadFile } from "../../utils/multer/uploadFile.js";
import * as companyServices from './company.controller.js'
import { companyIdValidationSchema, createCompanyValidationSchema, downloadExcelSheetValidationSchema, getCompanyAndRElatedJobsValidationSchema, getCompanyWithNameValidationSchema, updateCompanyValidationSchema } from "./company.validation.js";
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
    validation(getCompanyWithNameValidationSchema),
    asyncErrorHandler(companyServices.getCompanyWithName)
)
router.get('/related-jobs/:companyId' ,
    auth(),
    validation(getCompanyAndRElatedJobsValidationSchema),
    asyncErrorHandler(companyServices.getCompanyAndRelatedJobs)
)
router.post('/upload-logo/:companyId' , 
    auth(),
    uploadFile(FileType.IMAGE).single('image'),
    validation(companyIdValidationSchema),
    asyncErrorHandler(companyServices.uploadLogo)
)
router.post('/upload-coverPic/:companyId' , 
    auth(),
    uploadFile(FileType.IMAGE).single('image'),
    validation(companyIdValidationSchema),
    asyncErrorHandler(companyServices.uploadCovePic)
)
router.delete('/delete-logo/:companyId',
    auth(),
    validation(companyIdValidationSchema),
    asyncErrorHandler(companyServices.deleteLogo)
)
router.delete('/delete-coverPic/:companyId',
    auth(),
    validation(companyIdValidationSchema),
    asyncErrorHandler(companyServices.deleteCoverPic)
)

router.delete('/:companyId' , 
    auth(),
    validation(companyIdValidationSchema),
    asyncErrorHandler(companyServices.softDeleteCompany)
)

export default router;

//bonus end point

router.get('/download-app/:companyId' ,
    auth(),
    validation(downloadExcelSheetValidationSchema),
    asyncErrorHandler(companyServices.saveAppToExcelSheet)
)