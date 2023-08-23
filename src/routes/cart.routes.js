import { Router } from "express";
//import CartManager from "../dao/fileManager/controllers/CartManager.js";
//import ProductManager from "../dao/fileManager/controllers/ProductManager.js";
import CartService from "../dao/mongoManager/cartManagerMongo.js";
import ProductService from "../dao/mongoManager/productManagerMongo.js";

const CartRouter = Router();

//const cart = new CartManager();
const cart = new CartService();

//const productAll = new ProductManager();
const productAll = new ProductService();

/*==============
|  FileSystem  |
==============*/

//LEER
// CartRouter.get("/", async (req, res) => {
//   try {
//     let products = await cart.readCarts();
//     res.send(products);
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .send({ error: error, message: "No se pudo obtener el carrito." });
//   }
// });

// /*============
//  -     GET    -
//  ============*/
// CartRouter.get(`/`, async (req, res) => {
//   res.send(await cart.readCarts());
// });

// /*==============
//   -    POST    -
//   ============*/
// CartRouter.post("/", async (req, res) => {
//   let newCart = req.body;
//   res.send(await cart.addCarts(newCart));
// });

// /*==============
//   -   GET ID   -
//   ============*/
// CartRouter.get(`/:id`, async (req, res) => {
//   let id = req.params.id;
//   res.send(await cart.getCartsById(id));
// });

// /*==============
//   -    POST    -
//   ============*/
// CartRouter.post("/:cartId/products/:productId", async (req, res) => {
//   let cartId = req.params.cartId;
//   let productId = parseInt(req.params.productId);
//   res.send(await cart.addProductToCart(cartId, productId));
// });

/*==============
| MongoManager |
==============*/

//LEER
CartRouter.get("/", async (req, res) => {
  try {
    let producto = await cart.getCarts();

    res.status(202).send({
      result: "Carrito obtenido con exito",
      producto: producto,
    });
  } catch (error) {
    console.error("No se pudo obtener carrito con mongoose:" + error);
    res.status(500).send({
      error: "No se pudo obtener el carrito con mongoose",
      message: error,
    });
  }
});

//LEER ID
CartRouter.get("/:id", async (req, res) => {
  try {
    let _id = req.params.id;
    console.log(_id);

    let producto = await cart.getCartsById({ _id });

    res.status(202).send({
      result: "Carrito obtenido con exito",
      producto: producto,
    });
  } catch (error) {
    console.error("No se pudo obtener carrito con mongoose:" + error);
    res.status(500).send({
      error: "No se pudo obtener el carrito con mongoose",
      message: error,
    });
  }
});

//CREAR
CartRouter.post("/", async (req, res) => {
  try {
    let producto = await cart.addCarts(req.body);
    res.status(201).send(producto);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: error, message: "No se pudo guardar el Carrito." });
  }
});

//ELIMINAR
CartRouter.delete("/:id", async (req, res) => {
  try {
    let _id = req.params.id;
    console.log(_id);

    let eliminado = await cart.getCartsById({ _id });
    await cartService.deleteCart({ _id });

    res.status(202).send({
      result: "Carrito eliminado con exito",
      producto: eliminado,
    });
  } catch (error) {
    console.error("No se pudo obtener carrito con mongoose:" + error);
    res.status(500).send({
      error: "No se pudo eliminar el carrito con mongoose",
      message: error,
    });
  }
});

//MODIFICAR
CartRouter.put("/:id", async (req, res) => {
  try {
    let productUpdated = req.body;

    let productoActualizado = await cart.addProductToCart(
      req.params.id,
      productUpdated
    );

    res.status(202).send({
      result: "Producto modificado con exito",
      payload: productoActualizado,
    });
  } catch (error) {
    console.error("No se pudo actualizar usuario con mongoose:" + error);
    res.status(500).send({
      error: "No se pudo actualizar el usuario con mongoose",
      message: error,
    });
  }
});

export default CartRouter;
