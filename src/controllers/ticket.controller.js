import TicketService from "../services/dao/mongoManager/ticketManagerMongo.js";
import UserService from "../services/dao/mongoManager/userManagerMongo.js";
import ProductService from "../services/dao/mongoManager/productManagerMongo.js";

const ticketService = new TicketService();
const userService = new UserService();
const PS = new ProductService();

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
    const resultUser = await userService.getUserByID(_id);
    let ticketNumber = Date.now() + Math.floor(Math.random() * 10000 + 1);

    let amount = 0;

    for (const productData of resultUser.products) {
      const product = productData.product;
      let { quantity, _id } = productData;

      let productPrice = await PS.getProductbyId(_id);
      console.log("PRODUCT PRICE");
      console.log(productPrice.price);
      console.log("CANTIDAD PRODUCTOS");
      console.log(quantity);

      amount += productPrice.price * quantity;
    }
    console.log("SUMA TOTAL PRODUCTOS");
    console.log(amount);

    let ticket = {
      code: ticketNumber,
      purchaser: resultUser.email,
      purchase_datetime: new Date(),
      products: resultUser.products,
      amount,
    };
    console.log("COMPRA USUARIO");
    console.log(ticket);

    const ticketResult = await ticketService.createTicket(ticket);
    console.log(ticketResult);
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
