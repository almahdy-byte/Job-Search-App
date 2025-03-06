import { StatusCodes } from "http-status-codes";
import { asyncErrorHandler } from "../utils/errorHandlers/asyncErrorHandler.js"
import { decodeToken } from "../utils/token/decodeToken.js";
import { tokenTypes } from "../utils/globalEnums/enums.js";

export const auth =()=>{
    return(asyncErrorHandler(async(req , res , next)=>{
        const authorization = req.headers['authorization'];
        const decodedData = await decodeToken(authorization , tokenTypes.ACCESS, next )   ;
        if (!decodedData || !decodedData.user) {
            return next(new Error("Invalid refresh token", { cause: StatusCodes.UNAUTHORIZED }));
        }
        const {user} = decodedData
        if (!user) throw new Error('user not found', { cause: StatusCodes.NOT_FOUND });
        req.user = user;
        next()
    }))
}