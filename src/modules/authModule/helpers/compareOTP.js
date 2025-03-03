import { compare } from "../../../utils/hash/compare.js"

export const compareOTP = (code , confirmEmailOTP)=>{
        for (const otp of confirmEmailOTP) {  
            if(compare(code , otp.code)){
                return true
            }
        }
}