import mongoose, { model, Schema, Types } from "mongoose";
import { userModel } from "./user.model.js";

const messageSchema = new Schema({
    body: { 
        type: String,
        required: true
    },
    senderId: {
        type : Types.ObjectId,
        ref: "User", required: true
    },
},{timestamps : true});

const chatSchema = new mongoose.Schema({
    users:{
    senderId: {
        type: Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiverId: {
        type:Types.ObjectId,
        ref: "User",
        required: true
    }
},
    messages: [messageSchema]
}, { timestamps: true });


export const chatModel = model("Chat", chatSchema);