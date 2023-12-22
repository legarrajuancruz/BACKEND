import TicketService from "../services/dao/mongoManager/ticketManagerMongo.js";
import {
  cartService,
  productService,
  userService,
} from "../services/factory.js";

const ticketService = new TicketService();

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
    const { uid, cid } = req.body;
    uid.toString();
    cid.toString();

    const resultUser = await cartService.getUserByID(uid);
    const resultCart = await userService.getCartsById(cid);

    const outOfStock = [];
    const compraFinal = [];
    let amount = 0;

    //HACEMOS LA SUMA DE TODOS LOS PRODUCTOS EN EL CARRITO USER
    for (const item of resultCart.products) {
      const precioProducto = item.product.price;
      const cantidad = item.quantity;

      const subtotal = precioProducto * cantidad;
      amount += subtotal;

      const idProduct = item.product._id;
      const productFinded = await productService.getProductbyId(item._id);

      //SI NO HAY STOCK SE ALMACENA EN UN NUEVO ARRAY
      if (item.quantity > productFinded.stock) {
        console.log("PRODUCTO SIN STOCK SUFICIENTE");
        console.log(productFinded);
        outOfStock.push(productFinded);
      }

      //LOGICA PARA RESTAR STOCK DE PRODUCTO
      let restado = productFinded.stock - item.quantity;
      let restarStock = {
        stock: restado,
      };
      await productService.actualizarProducto(productFinded._id, restarStock);

      //SI HAY STOCK PASA A LA COMPRA FINAL
      compraFinal.push(productFinded);
    }

    //GENERAMOS ARRAY PARA CREAR
    let ticketNumber = Date.now() + Math.floor(Math.random() * 10000 + 1);
    let ticket = {
      code: ticketNumber,
      purchaser: resultUser.email,
      purchase_datetime: new Date(),
      products: compraFinal,
      amount,
    };

    console.log("TICKET");
    console.log(ticket);

    //SE AGREGA TICKET A COLECCION TICKETS
    const ticketResult = await ticketService.createTicket(ticket);
    const ticketId = ticketResult._id;
    const userId = resultUser._id;

    //SE AGREGA TICKET A ORDERS DE USER
    const alta = await userService.updateUser(userId, ticketId);
    console.log(alta);

    //SI SE TERMINO LA COMPRA VACIAR CARRITO
    const resetCart = await cartService.vaciarCarrito(cid);
    console.log("SE VACIO EL CARRITO");

    //SI NO HAY STOCK DE UN PRODUCTO RETORNA AL CARRITO
    if (outOfStock.length > 0) {
      const alta = await cartService.addProductToCart(resultCart, outOfStock);
      console.log(`Nohay stock suficiente de ${alta}`);
    }
    res.send({
      status: 200,
      payload: ticketResult,
    });
  } catch (error) {
    console.error(error);
  }
};
