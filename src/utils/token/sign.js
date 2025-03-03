import jwt from "jsonwebtoken";
export const sign =async(payload = {} , signature = "" , expiresIn = '30m')=> await jwt.sign(payload , signature , {expiresIn})