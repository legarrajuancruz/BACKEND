import { Router } from "express";
import { sendSMS } from "../controllers/sms.controller.js";

const SMSRouter = Router();

SMSRouter.get("/", sendSMS);

export default SMSRouter;
