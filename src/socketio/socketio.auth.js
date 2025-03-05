import { userModel } from "../DB/models/user.model.js";
import { Roles, tokenTypes } from "../utils/globalEnums/enums.js";
import { verify } from "../utils/token/verify.js";

export const decodeToken = async ({ authorization, type = tokenTypes.ACCESS, next }) => {
    if (!authorization) return next(new Error('please send token'));
    const parts = authorization.split(" ");
    if (parts.length !== 2) return next(new Error('Invalid token format'));
    const [barer, token] = parts;
    if (!barer || !token) return next(new Error('please send token'));
    
    let accessSignature;
    
    switch (barer) {
        case Roles.ADMIN:
            accessSignature = process.env.ADMIN_ACCESS_TOKEN;
            break;
            case Roles.USER:
                accessSignature = process.env.USER_ACCESS_TOKEN;
                break;
                default:
                    return next(new Error('Invalid role'));
    }
        if (!accessSignature)
            return next(new Error('Token signature is missing'));
        try {
        const decoded = await verify(token, accessSignature);
        
        const user = await userModel.findOne({_id : decoded.id, isConfirmed: true});
        
        if (!user) return next(new Error('Invalid token'));
        return  user ;
}
    catch (error) {
        return next(error || new Error('Token verification failed'));
    }
};