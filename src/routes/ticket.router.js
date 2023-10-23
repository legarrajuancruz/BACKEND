import { Router } from "express";
import {
  getTickets,
  createTicket,
  getTicketById,
} from "../controllers/ticket.controller.js";

const ticketRouter = Router();

ticketRouter.get("/", getTickets);
ticketRouter.post("/:uid", createTicket);
ticketRouter.get("/:tid", getTicketById);

export default ticketRouter;
