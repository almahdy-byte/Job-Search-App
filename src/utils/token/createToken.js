
import { Roles } from "../globalEnums/enums.js";
import { sign } from "./sign.js"

export const createToken =async (role = Roles.USER , payload = {})=>{
    let accessSignature
    let refreshSignature
    switch (role) {
        case Roles.USER:
            accessSignature = process.env.USER_ACCESS_TOKEN;
            refreshSignature = process.env.USER_REFRESH_TOKEN
            break;
        case Roles.ADMIN:
            accessSignature = process.env.ADMIN_ACCESS_TOKEN;
            refreshSignature = process.env.ADMIN_REFRESH_TOKEN;
            break;
        default:
            break;
    }    
    let accessToken =await sign(payload , accessSignature , '30m');
    let refreshToken =await sign(payload , refreshSignature , '1w');
    return {
        accessToken ,
        refreshToken
    }
}