import { asyncErrorHandler } from "../utils/errorHandlers/asyncErrorHandler.js";

export const allowTo=(...roles)=>{
    return (asyncErrorHandler((req , res, next)=>{
        const user = req.user;
        if(!roles.includes(user.role)) return next(new Error('you are not allowed to access this end point'));
        next()
    }))
    }