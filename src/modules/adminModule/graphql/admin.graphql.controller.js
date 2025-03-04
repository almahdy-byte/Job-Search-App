import { userModel } from "../../../DB/models/user.model.js"
import { allowTo } from "../../../middleWare/graphql/allowTo.MiddleWare.js";
import { auth } from "../../../middleWare/graphql/auth.graphql.middleWare.js"
import { Roles } from "../../../utils/globalEnums/enums.js";

export const getAllUsers = async(_,args , context)=>{
    
    const user =await auth(context.authorization);    
    allowTo(user.role , Roles.ADMIN);
    const users = await userModel.find({});
    console.log(users);
    
    return users
}