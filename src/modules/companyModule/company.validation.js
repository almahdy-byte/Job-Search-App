import Joi from "joi";
import { generalValidation } from "../../middleWare/validation.middleWare.js";

export const createCompanyValidationSchema = Joi.object({
    companyName : generalValidation.companyName,
    description : generalValidation.description,
    companyEmail : generalValidation.companyEmail,
    numberOfEmployees:generalValidation.numberOfEmployees,
    industry:generalValidation.industry,
    companyEmail : generalValidation.companyEmail,
    address:generalValidation.address
}).required()

export const updateCompanyValidationSchema = Joi.object({
    companyId : generalValidation.id.required(),
    companyName : generalValidation.companyName,
    description : generalValidation.description,
    companyEmail : generalValidation.companyEmail,
    numberOfEmployees:generalValidation.numberOfEmployees,
    industry:generalValidation.industry,
    companyEmail : generalValidation.companyEmail,
    address:generalValidation.address
})

export const getCompanyWithNameValidationSchema = Joi.object({
    companyName : generalValidation.companyName.required()
})

export const getCompanyAndRElatedJobsValidationSchema = Joi.object({
    companyId: generalValidation.id.required()
})