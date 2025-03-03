import { StatusCodes } from "http-status-codes"

export const asyncErrorHandler = (fn)=>{
    return((req , res , next)=>{
        fn(req , res , next).catch(err=>{
            return next(new Error(err + '' || 'internal server error' , {cause:StatusCodes.BAD_REQUEST}))
        })
    })
}