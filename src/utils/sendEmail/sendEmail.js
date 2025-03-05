import nodemailer from "nodemailer";
import EventEmitter from "events";
import { subjects } from "../globalEnums/enums.js";
export const sendEmail = async({to , subject ,text ,html})=>{
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  service: "gmail",
  port: 465,
  secure: true, // true for port 465, false for other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: 'mohamedalmahdy02@gmail.com', 
    to, 
    subject, 
    text, 
    html,
  });

}

main().catch(console.error);

}

export const emailEvent = new EventEmitter();
emailEvent.on('confirmEmail',async({to , subject = subjects.RESET_PASSWORD , text , html})=>{
await sendEmail({to , subject , text , html})
})

emailEvent.on('resetPassword',async({to , subject = subjects.RESET_PASSWORD , text , html})=>{
  await sendEmail({to , subject , text , html});
  
  })
  emailEvent.on('acceptApp',async({to , subject = subjects.ACCEPT_APP , text , html})=>{
    await sendEmail({to , subject , text , html});
    
    })

    emailEvent.on('rejectApp',async({to , subject = subjects.REJECT_APP , text , html})=>{
      await sendEmail({to , subject , text , html});
})