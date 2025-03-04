import Joi from "joi"
import { generalValidation } from "../../middleWare/validation.middleWare.js"

export const addJobValidationSchema = Joi.object({
    jobTitle:generalValidation.jobTitle,
    jobLocation : generalValidation.jobLocation,
    workingTime:generalValidation.workingTime,
    seniorityLevel:generalValidation.seniorityLevel,
    jobDescription:generalValidation.jobDescription,
    technicalSkills :generalValidation.technicalSkills,
    softSkills :generalValidation.softSkills ,
    companyId : generalValidation.id
}).required()

export const updateJobValidationSchema = Joi.object({
    jobTitle:generalValidation.jobTitle,
    jobLocation : generalValidation.jobLocation,
    workingTime:generalValidation.workingTime,
    seniorityLevel:generalValidation.seniorityLevel,
    jobDescription:generalValidation.jobDescription,
    technicalSkills :generalValidation.technicalSkills,
    softSkills :generalValidation.softSkills ,
    companyId : generalValidation.id,
    jobId : generalValidation.id
})