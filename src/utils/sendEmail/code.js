import { customAlphabet } from "nanoid"

export const code =async ()=>{
     const OTP =  customAlphabet('0123456789' , 6);
     return OTP();
}