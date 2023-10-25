import TicketService from "../services/dao/mongoManager/ticketManagerMongo.js";
import UserService from "../services/dao/mongoManager/userManagerMongo.js";
import ProductService from "../services/dao/mongoManager/productManagerMongo.js";

const ticketService = new TicketService();
const US = new UserService();
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
export const createTicket = async (req, res) => {
  try {
    const _id = req.params.uid;

    const resultUser = await US.getUserByID({ _id });
    console.log(" USUARIO ENCONTRADO");
    console.log(resultUser);

    const outOfStock = {};
    let amount = 0;

    for (const productData of resultUser.products) {
      const product = productData.product;
      let { quantity, _id } = productData;

      let productFinded = await PS.getProductbyId(_id);

      if (quantity > productFinded.stock) {
        outOfStock.push(productData);
        console.log("PRODUCTO FUERA DE STOCK" + productFinded);
      }

      amount += productFinded.price * quantity;
    }
    console.log("SUMA TOTAL PRODUCTOS");
    console.log(amount);

    let ticketNumber = Date.now() + Math.floor(Math.random() * 10000 + 1);

    let ticket = {
      code: ticketNumber,
      purchaser: resultUser.email,
      purchase_datetime: new Date(),
      products: resultUser.products,
      amount,
    };
    const buscar = await ticketService.getTicketByPurchaser(ticket.purchaser);
    console.log(" ACA ESTA EL USUARIO!!!!");
    console.log(buscar);

    if (buscar) {
      let ticket = {
        code: ticketNumber,
        purchaser: resultUser.email,
        purchase_datetime: new Date(),
        products: resultUser.products,
        amount,
      };
      const ticketResult = await ticketService.resolveTicket(
        buscar._id,
        ticket
      );
      res.send({ status: 200, payload: ticketResult });
    }

    //await US.vaciarCarrito(_id);
    const ticketResult = await ticketService.createTicket(ticket);

    const nuevaOrden = resultUser.orders.push(ticketResult._id);
    console.log(nuevaOrden);
    await US.updateUser({ _id }, nuevaOrden);

    res.send({ status: 200, payload: ticketResult });
  } catch (error) {
    console.error(error);
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
