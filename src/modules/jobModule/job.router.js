import { Router } from "express";
import { auth } from "../../middleWare/auth.middleWare.js";
import * as jobServices from './job.controller.js'
import { asyncErrorHandler } from "../../utils/errorHandlers/asyncErrorHandler.js";
import { validation } from "../../middleWare/validation.middleWare.js";
import { addJobValidationSchema, updateJobValidationSchema } from "./job.validation.js";
import { getCompanyById, getCompanyByName } from "../../middleWare/getCompany.middleWare.js";
const router = Router({mergeParams : true});

router.get('/', (req , res , next)=>{
    return res.json({company : req.params.companyId})
})

router.post('/' , 
    auth(),
    getCompanyById,
    validation(addJobValidationSchema),
    asyncErrorHandler(jobServices.addJob)
)
router.patch('/:jobId' , 
    auth(),
    validation(updateJobValidationSchema),
    asyncErrorHandler(jobServices.updateJob)
)
router.get('/search-company-jobs/:companyName',
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
    getCompanyById,
    asyncErrorHandler(jobServices.getApplications)
)
export default router