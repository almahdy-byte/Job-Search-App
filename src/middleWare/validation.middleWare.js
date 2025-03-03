import Joi from "joi";
import { StatusCodes } from "http-status-codes";
import { Gender, Roles } from "../utils/globalEnums/enums.js";
import { asyncErrorHandler } from "../utils/errorHandlers/asyncErrorHandler.js";

export const validation = (schema)=>{
    return (req,res,next)=>{
        const data = {
            ...req.body,
            ...req.params,
            ...req.query    
        }
        
        const result = schema.validate(data);
        let errors = [];
        if(result.error){
            errors.push(result.error.details[0].message)
            return next(new Error(errors) , {cause:StatusCodes.BAD_REQUEST})  
        }
        next();
}
}






export const generalValidation = {
    firstName : Joi.string(),
    lastName : Joi.string(),
    email:Joi.string().email(),
    password:Joi.string().min(6),
    phone:Joi.string(),
    role : Joi.string().valid(...Object.values(Roles)),
    DOB:Joi.date(),
    gender:Joi.string().valid(...Object.values(Gender)),
    code : Joi.string().length(6)
}