
import { StatusCodes } from "http-status-codes";
import { DBConnection } from "./DB/connection.js";
import authRouter from "./modules/authModule/auth.router.js";
import { globalErrorHandler } from "./utils/errorHandlers/globalErrorHandler.js";
import dotenv from 'dotenv';
import userRouter from "./modules/userModule/user.router.js";
import adminRouter from "./modules/adminModule/admin.router.js";
import {schema} from './graphql.js'
import { createHandler } from "graphql-http/lib/use/express";
import companyRouter from "./modules/companyModule/company.router.js";
import cors from 'cors'
dotenv.config();
export const bootstrap = async (app ,express)=>{
app.use(express.json());
await DBConnection();
app.use(cors({
    origin:'*'
}))


app.use('/auth' , authRouter)
app.use('/user', userRouter)
app.use('/admin' , adminRouter)
app.use('/company' , companyRouter)
app.use('/graphql' , createHandler({schema ,
    context:function(req){
        const authorization = req.headers.authorization;
        return {authorization}
    }
}))


app.use('*' ,(req ,res ,next)=>{
    return res.status(StatusCodes.ACCEPTED).json({message : 'page not found'})
})

app.use('/uploads' , express.static('uploads'));
app.use(globalErrorHandler)
}