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
    companyName : generalValidation.companyName , 

}).required()

export const updateJobValidationSchema = Joi.object({
    jobTitle:generalValidation.jobTitle,
    jobLocation : generalValidation.jobLocation,
    workingTime:generalValidation.workingTime,
    seniorityLevel:generalValidation.seniorityLevel,
    jobDescription:generalValidation.jobDescription,
    technicalSkills :generalValidation.technicalSkills,
    softSkills :generalValidation.softSkills ,
    companyName : generalValidation.companyName,
    jobId : generalValidation.id,

})

export const findJobValidationSchema = Joi.object({
    jobTitle:generalValidation.jobTitle,
    jobLocation : generalValidation.jobLocation,
    workingTime:generalValidation.workingTime,
    seniorityLevel:generalValidation.seniorityLevel,
    jobDescription:generalValidation.jobDescription,
    technicalSkills :generalValidation.technicalSkills,
    softSkills :generalValidation.softSkills ,
    companyName : generalValidation.companyName,
    jobId : generalValidation.id,
    page : generalValidation.page,
    size : generalValidation.size,

})
export const acceptOrRejectValidationSchema = Joi.object({
    companyName : generalValidation.companyName,
    appId : generalValidation.id,
})

export const deleteJobValidationSchema = Joi.object({
    companyName : generalValidation.companyName,
    jobId : generalValidation.id,
})

export const mainJobValidationSchema = Joi.object({
    companyName : generalValidation.companyName,
    jobId : generalValidation.id,
})