import jwt from "jsonwebtoken"


export const verify =async(token , signature) => await jwt.verify(token , signature)