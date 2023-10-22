import { Router } from "express";
import {
  getTickets,
  createTicket,
  getTicketById,
} from "../controllers/tickets.controller.js";

const ticketRouter = Router();

ticketRouter.get("/", getTickets);
ticketRouter.post("/", createTicket);
ticketRouter.get("/:tid", getTicketById);

export default ticketRouter;
