
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
import chatRouter from "./modules/chatModule/chat.router.js";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import "dotenv/config"
export const bootstrap = async (app ,express)=>{
app.use(express.json());
await DBConnection();


app.use(cors({
    origin:'*'
}))

app.use(rateLimit({
    limit : 3,
    message : 'to many requests , please try again later',
    skipSuccessfulRequests : true,
    handler:(req , res , next , options)=>{
        return next(new Error(options.message , {cause : StatusCodes.TOO_MANY_REQUESTS}))
    }

}))

app.use(helmet({
    xPoweredBy:false
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
app.use('/chat' , chatRouter)
app.get('/' ,
        (req,res,next)=>res.json({message:"job search main route"})
       )
app.use('*' ,(req ,res ,next)=>{
    return res.status(StatusCodes.NOT_FOUND).json({message : 'page not found'})
})

app.use('/uploads' , express.static('uploads'));
app.use(globalErrorHandler)
}
