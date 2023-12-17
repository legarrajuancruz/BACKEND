import TicketService from "../services/dao/mongoManager/ticketManagerMongo.js";
import UserService from "../services/dao/mongoManager/userManagerMongo.js";
import ProductService from "../services/dao/mongoManager/productManagerMongo.js";
import CartService from "../services/dao/mongoManager/cartManagerMongo.js";

const ticketService = new TicketService();
const CS = new CartService();
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
    const _id = req.body;
    _id.toString();

    const resultCart = await CS.getCartsById(_id);
    console.log(" CARRITO ENCONTRADO");
    console.log(resultCart);

    console.log(resultCart.products);

    const outOfStock = {};
    let amount = 0;

    //HACEMOS LA SUMA DE TODOS LOS PRODUCTOS EN EL CARRITO USER
    for (const item of resultCart.products) {
      const precioProducto = item.product.price;
      const cantidad = item.quantity;

      const subtotal = precioProducto * cantidad;
      amount += subtotal;

      const product = item.product._id;
      product.toString();
      const productFinded = await PS.getProductbyId(product);
      console.log("PRODUCTO ENCONTRADO");
      console.log(productFinded);
      //SI NO HAY STOCK SE ALMACENA EN UN NUEVO ARRAY
      if (item.quantity > productFinded.stock) {
        console.log("PRODUCTO SIN STOCK SUFICIENTE");
        console.log(productData);
        outOfStock = { productData };
      }

      //LOGICA PARA RESTAR STOCK DE PRODUCTO
      let restado = productFinded.stock - productData.quantity;
      let restarStock = {
        stock: restado,
      };
      await PS.actualizarProducto(productFinded._id, restarStock);
    }

    // //GENERAMOS ARRAY PARA CREAR
    // let ticketNumber = Date.now() + Math.floor(Math.random() * 10000 + 1);
    // let ticket = {
    //   code: ticketNumber,
    //   purchaser: resultUser.email,
    //   purchase_datetime: new Date(),
    //   products: resultUser.products,
    //   amount,
    // };

    // console.log("NUEVO TICKET USUARIO");

    // //SE AGREGA TICKET A COLECCION TICKETS
    // const ticketResult = await ticketService.createTicket(ticket);
    // const ticketId = ticketResult._id;
    // const userId = resultUser._id;

    // //SE AGREGA TICKET A ORDERS DE USER
    // const alta = await US.updateUser(userId, ticketId);
    // console.log(alta);

    // //SI SE TERMINO LA COMPRA VACIAR CARRITO
    // const resetCart = await US.vaciarCarrito(userId);
    // console.log("SE VACIO EL CARRITO");

    // //SI NO HAY STOCK DE UN PRODUCTO RETORNA AL CARRITO
    // if (outOfStock.length > 0) {
    //   const alta = await US.updateUser(userId, outOfStock);
    // }

    res.send({
      status: 200, //payload: ticketResult
    });
  } catch (error) {
    console.error(error);
  }
};
