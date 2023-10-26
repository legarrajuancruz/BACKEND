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
      console.log("TICKET USUARIO ACTUALIZADO");
      const ticketResult = await ticketService.resolveTicket(
        buscar._id,
        ticket
      );
      resultUser.orders.push(ticketResult._id);
      await US.updateUser({ buscar }, resultUser);

      const nuevaOrden = resultUser.orders.push(ticketResult.code);
      console.log("NUEVA ORDEN");
      await US.updateUser(_id, nuevaOrden.toString());
      const borrado = await US.vaciarCarrito(_id);
      console.log("BORRADO");
      console.log(borrado);
      res.send({ status: 200, payload: ticketResult });
    }

    console.log("NUEVO TICKET USUARIO");
    const ticketResult = await ticketService.createTicket(ticket);
    resultUser.orders.push(ticketResult._id);
    await US.updateUser({ buscar }, resultUser);

    const nuevaOrden = resultUser.orders.push(ticketResult.code);
    console.log(nuevaOrden);
    await US.create({ _id }, { orders: nuevaOrden });

    const borrado = await US.vaciarCarrito(_id);
    console.log(borrado);
    res.send({ status: 200, payload: ticketResult });
  } catch (error) {
    console.error(error);
  }
};
