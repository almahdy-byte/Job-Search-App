import { Router } from "express";
import { auth } from "../../middleWare/auth.middleWare.js";
import { allowTo } from "../../middleWare/allowTo.middleWare.js";
import { Roles } from "../../utils/globalEnums/enums.js";
import { validation } from "../../middleWare/validation.middleWare.js";
import { approveCompanyValidation, banOrUnBanCompanyValidation, banOrUnBanUserValidation } from "./admin.validation.js";
import * as adminServices from './admin.controller.js'
import { asyncErrorHandler } from "../../utils/errorHandlers/asyncErrorHandler.js";

const router = Router();


router.post('/ban-unban-user/:userId' ,
    auth(),
    allowTo(Roles.ADMIN),
    validation(banOrUnBanUserValidation),
    asyncErrorHandler(adminServices.banOrUnBanUser)
)

router.post('/ban-unban-company/:companyId' ,
    auth(),
    allowTo(Roles.ADMIN),
    validation(banOrUnBanCompanyValidation),
    asyncErrorHandler(adminServices.banOrUnBanCompany)
)

router.patch('/approve-company/:companyId' , 
    auth(),
    allowTo(Roles.ADMIN),
    validation(approveCompanyValidation),
    asyncErrorHandler(adminServices.approveCompany)
)

export default router;