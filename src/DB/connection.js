import { connect } from "mongoose"


export const DBConnection = async()=>{
await connect(process.env.DB_URI)
.then(()=>{
    console.log(`Data Base connected successfully`);
})
.catch((err)=>{
    console.log(err);
})
}