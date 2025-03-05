import { StatusCodes } from "http-status-codes";
import { asyncErrorHandler } from "../utils/errorHandlers/asyncErrorHandler.js"
import { decodeToken } from "../utils/token/decodeToken.js";
import { tokenTypes } from "../utils/globalEnums/enums.js";

export const auth =()=>{
    return(asyncErrorHandler(async(req , res , next)=>{
        const authorization = req.headers['authorization'];
        const {user} = await decodeToken(authorization , tokenTypes.ACCESS, next );
        if (!user) throw new Error('user not found', { cause: StatusCodes.NOT_FOUND });
        req.user = user;
        next()
    }))
}