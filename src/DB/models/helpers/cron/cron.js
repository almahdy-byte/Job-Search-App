import cron from 'node-cron'
import { userModel } from '../../user.model.js';

export const userOTPSchedule = cron.schedule("* * * * * *" ,async function() {
    const now = new Date();
    await userModel.updateMany({
        "OTP.expiresIn" : { $lt: now },
    },
{
    $pull:{
        OTP : {expiresIn : {$lt : now}}
    }
})

},{
    scheduled : true
})

userOTPSchedule.start()