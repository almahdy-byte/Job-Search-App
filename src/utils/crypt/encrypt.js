
import CryptoJS from "crypto-js"
export const encrypt =async(text)=> await CryptoJS.AES.encrypt(text , process.env.ENCRYPTION_KEY).toString()

