import Joi from "joi";
import { generalValidation } from "../../middleWare/validation.middleWare.js";

export const updateUserValidationSchema = Joi.object({
    firstName : generalValidation.firstName,
    lastName : generalValidation.lastName,
    phone : generalValidation.phone,
    gender : generalValidation.gender,
    DOB :generalValidation.DOB
})

export const updatePasswordValidationSchema = Joi.object({
    oldPassword : generalValidation.password,
    newPassword : generalValidation.password
}).required()

export const getAndDeleteUserValidationSchema = Joi.object({
    userId : generalValidation.id.required()
})