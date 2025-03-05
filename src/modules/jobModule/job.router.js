import { Router } from "express";
import { auth } from "../../middleWare/auth.middleWare.js";
import * as jobServices from './job.controller.js'
import { asyncErrorHandler } from "../../utils/errorHandlers/asyncErrorHandler.js";
import { validation } from "../../middleWare/validation.middleWare.js";
import { acceptOrRejectValidationSchema, addJobValidationSchema, deleteJobValidationSchema, updateJobValidationSchema } from "./job.validation.js";
import {  getCompanyByName } from "../../middleWare/getCompany.middleWare.js";
import { uploadFile } from "../../utils/multer/uploadFile.js";
import { FileType } from "../../utils/globalEnums/enums.js";
const router = Router({mergeParams : true});


router.post('/' , 
    auth(),
    getCompanyByName,
    validation(addJobValidationSchema),
    asyncErrorHandler(jobServices.addJob)
)
router.patch('/:jobId' , 
    auth(),
    validation(updateJobValidationSchema),
    asyncErrorHandler(jobServices.updateJob)
)
router.get('/',
    auth(),
    getCompanyByName,
    asyncErrorHandler(jobServices.getJobsForCompany)
)
router.get('/find-job/',
    auth(),
    asyncErrorHandler(jobServices.jobSearch)
)

router.get('/get-applications/:jobId',
    auth(),
    getCompanyByName,
    asyncErrorHandler(jobServices.getApplications)
)
router.post('/apply-job/:jobId' , 
    auth(),
    getCompanyByName,
    uploadFile([...FileType.IMAGE , ...FileType.PDF]).single('pdf'),
    asyncErrorHandler(jobServices.applyJob)

)
router.patch('/accept-application/:appId' ,
    auth(),
    getCompanyByName,
    validation(acceptOrRejectValidationSchema),
    asyncErrorHandler(jobServices.acceptApp)
)
router.patch('/reject-application/:appId' ,
    auth(),
    getCompanyByName,
    validation(acceptOrRejectValidationSchema),
    asyncErrorHandler(jobServices.rejectApp)
)
router.delete('/:jobId',
    auth(),
    getCompanyByName,
    validation(deleteJobValidationSchema),
    asyncErrorHandler(jobServices.deleteJob)
)
export default router