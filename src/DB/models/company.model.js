import { Types , model , Schema } from "mongoose"

const companySchema = new Schema({
    companyName:{
        type:String,
        unique:true,
        required:true
    },
    description:{
        type:String,
    },
    industry:{
        type:String,
    },
    address:{
        type:String
    },
    numberOfEmployees:{
        type:Number,
        validate:{
            validator:function(v){
                return (v >= 11 && v <= 20 )
            },
            message:props=>`${props.value} employees must be in range 11 and 20`
        }
    },
    companyEmail:{
        type:String,
        required:true,
        unique:true
    },
    createdBy:{
        type:Types.ObjectId,
        ref:'Users',
        required:true
    },
    logo:{
        secure_url:{
            type:String
        },
        public_id:{
            type:String
        }
    },
    coverPic:{
        secure_url:{
            type:String
        },
        public_id:{
            type:String
        }
    },
    HRs:[{
        type:Types.ObjectId,
        ref:'Users',
        unique : true
    }],
    bannedAt:{
        type:Date
    },
    deletedAt:{
        type:Date
    },
    legalAttachment:{
        secure_url:{
            type:String
        },
        public_id:{
            type:String
        }
    },
    approvedByAdmin:{
        type:Boolean,
        default:false
    }
},{toJSON:{virtuals : true} , toObject:{virtuals:true}})
companySchema.virtual('Jobs' ,{
    localField:'_id',
    foreignField:'companyId',
    ref:'Jobs'
})
export const companyModel = model('Company' , companySchema)