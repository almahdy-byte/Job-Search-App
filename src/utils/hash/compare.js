import bcrypt from 'bcrypt'

export const compare = (text , hashedText)=> bcrypt.compareSync(text , hashedText)