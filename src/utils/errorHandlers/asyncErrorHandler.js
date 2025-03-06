import { StatusCodes } from "http-status-codes"

export const asyncErrorHandler = (fn)=>{
    return((req , res , next)=>{
        try {
            fn(req , res ,next)
        } catch (error) {
            return next(new Error (error + " " || "something went wrong" , {cause:StatusCodes.INTERNAL_SERVER_ERROR}))
        }
    })}


