import { io } from "./socketio.js";

import { chatModel } from "../DB/models/chat.model.js";
import {userModel} from "../DB/models/user.model.js";


export const getApp = async(HRs  =[], data)=>{
    if(!HRs.length)
        return
    for (const HR of HRs) {
        io.to(HR).emit('send_applications' , data)
    }
}



    export const sendMessage =async(socket)=>{
        return socket.on('private_message' ,async (data)=>{
            const {to , message} = data;
            const user = socket.user;
            const receiver =await userModel.findOne({_id:to});
            const chat = await chatModel.findOne({
                users:{
                $all:[user._id , receiver._id]}
            });
            if(chat.messages.length || user.isHr || user.isOwner){
                chat.messages.push({
                    body : message,
                    senderId : user._id,
                })
                await chat.save();
            }
            socket.to(receiver._id.toString()).emit('private_message' , {
                senderId:{
                    profilePic:{
                        secure_url:user.profilePic.secure_url,
                        userName:user.userName
                    }
                } , 
                body:message
            })
        })
        

    }