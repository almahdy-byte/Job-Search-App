import { model, Schema, Types } from "mongoose";
import { JobLocation, WorkingTime } from "../../utils/globalEnums/enums.js";
import mongoosePaginate from 'mongoose-paginate-v2';
import { StatusCodes } from "http-status-codes";
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

jobSchema.post(/^delete/ , {query : false , document : true } , async function (doc ,next ) {
    try {
        await doc.populate({
            path:'Applications'
        })
        if (doc.Applications && doc.Applications.length) {
        for (const app of this.Applications) {
            await app.deleteOne();
        }
        }
        next();
    } catch (error) {
        return next(new Error(error , {cause :StatusCodes.INTERNAL_SERVER_ERROR}));
    }
    });
jobSchema.plugin(mongoosePaginate)
export const jobModel = model('Jobs' , jobSchema)