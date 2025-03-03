import { StatusCodes } from "http-status-codes"

export const globalErrorHandler=(error , req , res , next)=>{
return res.status(error.cause || StatusCodes.INTERNAL_SERVER_ERROR).json({Error : error+"" || 'something went wrong'})
}