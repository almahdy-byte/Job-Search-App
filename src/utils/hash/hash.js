import bcrypt from 'bcrypt'

export const hash = (text)=> bcrypt.hashSync(text , Number(process.env.HASH_ROUNDS))