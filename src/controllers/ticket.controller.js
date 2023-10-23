import TicketService from "../services/dao/mongoManager/ticketManagerMongo.js";
import UserService from "../services/dao/mongoManager/userManagerMongo.js";
import config from "../config/config.js";

const ticketService = new TicketService();
const userService = new UserService();

export const getTickets = async (req, res, next) => {
  try {
    const tickets = await ticketService.getAll();
    res.send({ status: 200, payload: tickets });
  } catch (error) {
    next(error);
  }
};

export const getTicketById = async (req, res, next) => {
  try {
    const { tid } = req.params;
    const ticket = await ticketService.getTicketById(tid);
    res.send({ status: 200, payload: ticket });
  } catch (error) {
    next(error);
  }
};
export const createTicket = async (req, res, next) => {
  try {
    const _id = req.params.uid;
    console.log("USUARIO");
    console.log(_id);

    const resultUser = await userService.getUserByID(_id);
    console.log("COMPRA USUARIO");
    console.log(resultUser.products);

    console.log("EMAIL USUARIO");
    console.log(resultUser.email);

    let ticketNumber = Date.now() + Math.floor(Math.random() * 10000 + 1);

    let ticket = {
      code: ticketNumber,
      purchaser: resultUser.email,
      purchase_datetime: new Date(),
      products: resultUser.products,
      amount: "1000",
    };
    console.log(ticket);

    const ticketResult = await ticketService.createTicket(ticket);
    res.send({ status: 200, payload: ticketResult });
  } catch (error) {
    next(error);
  }
};

export const resolveTicket = async (req, res, next) => {
  try {
    const { resolve } = req.query;
    let ticket = await ticketService.getTicketById(req.params.tid);
    ticket.status = resolve;
    await ticketService.resolveTicket(ticket._id, ticket);
    res.send({ status: 200, result: "Order solved" });
  } catch (error) {
    next(error);
  }
};
