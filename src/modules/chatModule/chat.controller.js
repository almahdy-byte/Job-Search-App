import { StatusCodes } from "http-status-codes";
import { chatModel } from "../../DB/models/chat.model.js";
import { userModel } from "../../DB/models/user.model.js";


export const getChat = async(req , res , next)=>{

        const targetUser = await findOne({
            model:userModel,
            filter:{_id:req.params.userId}
        })
        if(!targetUser)
            return next(new Error('targetUser not found' , {cause:StatusCodes.NOT_FOUND}));
        if(targetUser._id.toString() === req.user._id.toString()) return next(new Error('you can not chat with your self' , {cause:StatusCodes.BAD_REQUEST}));
        let chat = await chatModel.findOne({
            users:{$all:[req.user._id , targetUser._id]}
        }).populate([{
            path:'messages.senderId',
            select:'profilePicture.secure_url userName _id'
        }])
        if(!user.isHR && !user.isOwner){
            return next(new Error('you can not start conversation with this user'))
        }
        chat = await chatModel.create({
            users:[req.user.id , req.params.userId],
            messages:[]
        })
        return res.status(StatusCodes.ACCEPTED).json({chat , messages:chat.messages} );

}