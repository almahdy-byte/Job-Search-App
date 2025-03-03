
import { StatusCodes } from "http-status-codes";
import { DBConnection } from "./DB/connection.js";
import authRouter from "./modules/authModule/auth.router.js";
import { globalErrorHandler } from "./utils/errorHandlers/globalErrorHandler.js";
import dotenv from 'dotenv';
import userRouter from "./modules/userModule/user.router.js";
import { decrypt } from "./utils/crypt/decrypt.js";
dotenv.config();
export const bootstrap = async (app ,express)=>{
app.use(express.json());
await DBConnection();



app.use('/auth' , authRouter)
app.use('/user', userRouter)

app.use('*' ,(req ,res ,next)=>{
    return res.status(StatusCodes.ACCEPTED).json({message : 'page not found'})
})
app.use('/uploads' , express.static('uploads'));
app.use(globalErrorHandler)
}