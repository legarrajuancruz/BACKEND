import { Router } from "express";
import {
  sendEmail,
  sendEmailWithAttachements,
} from "../controllers/email.controller.js";

const emailRouter = Router();

emailRouter.get("/", sendEmail);
emailRouter.get("/attachments", sendEmailWithAttachements);

export default emailRouter;
