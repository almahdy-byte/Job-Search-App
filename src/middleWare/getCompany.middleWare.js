import { StatusCodes } from "http-status-codes";
import { companyModel } from "../DB/models/company.model.js";
import { asyncErrorHandler } from "../utils/errorHandlers/asyncErrorHandler.js"

export const getCompanyById = asyncErrorHandler(async(req , res , next)=>{
        const {companyId} = req.params;
        const company = await companyModel.findOne({
            _id:companyId , deletedAt:null , bannedAt : null
        })
        if(!company)
            return  next(new Error('company not found' , {cause : StatusCodes.NOT_FOUND}) )
        req.company = company;
        next()
    }
    )
    export const getCompanyByName = asyncErrorHandler(async(req , res , next)=>{
        const {companyName} = req.params;
        const company = await companyModel.findOne({
            companyName:companyName , deletedAt:null , bannedAt : null 
        })
        if(!company)
            return  next(new Error('company not found' , {cause : StatusCodes.NOT_FOUND}) )
        req.company = company;
        next()
    }
    )
