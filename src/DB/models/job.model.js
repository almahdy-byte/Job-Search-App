import { model, Schema, Types } from "mongoose";
import { JobLocation, WorkingTime } from "../../utils/globalEnums/enums.js";

export const jobSchema = new Schema({
    jobTitle:{
        type:String
    },
    jobLocation:{
        type:String,
        enum:Object.values(JobLocation)
    },
    workingTime:{
        type:String,
        enum:Object.values(WorkingTime)
    },
    seniorityLevel:{
        type:String
    },
    jobDescription:{
        type:String
    },
    technicalSkills:[
        {type:String}
    ],
    softSkills:[
        {type:String}
    ],
    addedBy:{
        type:Types.ObjectId,
        ref:'Users'
    },
    updatedBy:{
        type:Types.ObjectId,
        ref:'Users'
    },
    closed:{
        type:Boolean,
        default:false
    },
    companyId:{
        type:Types.ObjectId,
        ref:'Company'
    },
    deletedAt:{
        type:Date
    }
},{toJSON:{virtuals : true}, toObject:{virtuals:true}})
jobSchema.virtual("Applications",{
    ref:'App',
    localField:"_id",
    foreignField:"jobId"
})

export const jobModel = model('Jobs' , jobSchema)