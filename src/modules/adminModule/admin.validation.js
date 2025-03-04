import Joi from "joi";
import { generalValidation } from "../../middleWare/validation.middleWare.js";

export const banOrUnBanUserValidation = Joi.object({
    userId : generalValidation.id.required()
})

export const banOrUnBanCompanyValidation = Joi.object({
    companyId : generalValidation.id.required()
})
export const approveCompanyValidation = Joi.object({
    companyId : generalValidation.id.required()
})