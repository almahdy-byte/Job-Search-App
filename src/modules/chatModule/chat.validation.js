import Joi from "joi";
import { generalValidation } from "../../middleWare/validation.middleWare.js";

export const getChatValidationSchema = Joi.object({
    uerId : generalValidation.id.required()
})