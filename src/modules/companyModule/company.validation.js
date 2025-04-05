import Joi from "joi";
import { generalValidation } from "../../middleWare/validation.middleWare.js";

export const createCompanyValidationSchema = Joi.object({
    companyName : generalValidation.companyName.required(),
    description : generalValidation.description.required(),
    companyEmail : generalValidation.companyEmail.required(),
    numberOfEmployees:generalValidation.numberOfEmployees.required(),
    industry:generalValidation.industry.required(),
    companyEmail : generalValidation.companyEmail.required(),
    HRs:generalValidation.HRs,
    address:generalValidation.address.required()
})

export const updateCompanyValidationSchema = Joi.object({
    companyId : generalValidation.id.required(),
    companyName : generalValidation.companyName,
    description : generalValidation.description,
    companyEmail : generalValidation.companyEmail,
    numberOfEmployees:generalValidation.numberOfEmployees,
    industry:generalValidation.industry,
    companyEmail : generalValidation.companyEmail,
    address:generalValidation.address,
    HRs:generalValidation.HRs
})

export const getCompanyWithNameValidationSchema = Joi.object({
    companyName : generalValidation.companyName.required()
})

export const getCompanyAndRElatedJobsValidationSchema = Joi.object({
    companyId: generalValidation.id.required()
})

export const companyIdValidationSchema=Joi.object({
    companyId: generalValidation.id.required()
})
export const downloadExcelSheetValidationSchema=Joi.object({
    companyId: generalValidation.id.required(),
    date: Joi.string().required()
})