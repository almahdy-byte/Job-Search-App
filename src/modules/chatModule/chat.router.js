import { Router } from "express";
import { auth } from "../../middleWare/auth.middleWare.js";
import { validation } from "../../middleWare/validation.middleWare.js";
import { getChatValidationSchema } from "./chat.validation.js";
import * as chatServices from './chat.controller.js'
import { asyncErrorHandler } from "../../utils/errorHandlers/asyncErrorHandler.js";
const router = Router();

router.get('/:userId',
    auth(),
    validation(getChatValidationSchema),
    asyncErrorHandler(chatServices.getChat)
)

export default router