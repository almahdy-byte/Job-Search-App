import { model, Schema, Types } from "mongoose";

const appSchema = new Schema({
    jobId : {
        type : Types.ObjectId,
        ref:"Jobs"
    },
    userId:{
        type:Types.ObjectId,
        ref:'Users'
    },
    userCV:{
        secure_url:{
            type : String
        },
        public_id:{
            type : String
        },
    },
    status:{
        type:String,
        default:'pending'
    }
})


export const appModel = model('App' , appSchema);

