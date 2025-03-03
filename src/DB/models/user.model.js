import { model, Schema, Types } from "mongoose";
import { Gender, OTPTypes, Providers, Roles } from "../../utils/globalEnums/enums.js";
import { decrypt } from "../../utils/crypt/decrypt.js";
import { encrypt } from "../../utils/crypt/encrypt.js";


const userSchema = new Schema({
    firstName:{
        type : String,
        required : true
    },
    lastName :{
        type:String,
        required : true
    } , 
    email:{
        type:String,
        required:true,
        unique:true
    } , 
    password:{
        type:String , 
    },
    provider:{
        type:String,
        enum:Object.values(Providers),
        default:Providers.SYSTEM
    },
    gender:{
        type:String,
        enum:Object.values(Gender)
    },
    DOB:{
        type:Date,
        validate:{
            validator:function(v){
                return ( new Date().getFullYear() - new Date(v).getFullYear()  >= 18);
            },
            message:props=>`${props.value} is not a valid date`
        }
    },
    phone:{
        type:String,
    },
    role:{
        type:String,
        enum:Object.values(Roles) ,
        default : Roles.USER
    },
    isConfirmed : {
        type:Boolean,
        default:false,
    },
    bannedAt:{
        type:Date
    },
    deletedAt:{
        type:Date
    },
    upDatedBy:{
        type:Types.ObjectId,
        ref:'Users'
    },
    profilePic:{
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
    changeCredentialTime:{
        type:Date,
        default : Date.now()
    },
    OTP:[{
        code:{
            type:String
        },
        OTPType:{
            type:String,
            enum:Object.values(OTPTypes)
        },
        expiresIn: { 
            type: Date, 
            default: () => new Date(Date.now() + 10 * 60 * 1000) 
        }
    }],
    isDeleted:{
        type:Boolean,
        default:false
    }
})

userSchema.post(/^find/ , async (user , next)=>{
    if(user && user.phone){
        user.phone =  await decrypt(user.phone);
    }
    next();
})

userSchema.pre(/^save/ , async function(next){
    if(this.isModified('phone')){
        this.phone = await encrypt(this.phone);
    }
    next();
})
// userSchema.pre("findOneAndUpdate" , async function(next){
//     if(this.isModified('phone')){
//         this.phone = await encrypt(this.phone);
//     }
//     next();
// })

export const userModel = model('Users' , userSchema);