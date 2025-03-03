import { StatusCodes } from "http-status-codes";
import multer from "multer";
import { nanoid } from "nanoid";
import path from 'path';
import fs from 'fs'


export const uploadFile = (type ) => {    
    const storage = multer.diskStorage({
    });
    const fileFilter = (req , file , cb)=>{
        if(type.includes(file.mimetype)){
            return cb(null , true)
        }
        return cb(new Error('invalid type' ,{cause:StatusCodes.BAD_REQUEST}) , false);
    }

    const upload = multer({ storage , fileFilter });    
    return upload;
};
