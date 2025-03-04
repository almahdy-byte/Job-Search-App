import { StatusCodes } from "http-status-codes";
import { tokenTypes } from "../../utils/globalEnums/enums.js"
import { decodeTokenGraphQl } from "../../utils/token/decodeToken.js"

export const auth = async (authorization) =>{
    const {user} =await decodeTokenGraphQl(authorization , tokenTypes.ACCESS);
    
    if(!user) throw new Error('user not found' , {cause:StatusCodes.NOT_FOUND});
    return user;
}