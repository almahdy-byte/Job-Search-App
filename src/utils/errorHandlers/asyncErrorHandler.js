import { StatusCodes } from "http-status-codes"

export const asyncErrorHandler = (fn)=>{
    return((req , res , next)=>{
            fn(req , res , next)
            .catch ((error) => next(new Error (error + " " || "something went wrong" , {cause:StatusCodes.INTERNAL_SERVER_ERROR})))
})}