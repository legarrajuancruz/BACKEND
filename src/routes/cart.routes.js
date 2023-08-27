import { Router } from "express";
//import CartManager from "../dao/fileManager/controllers/CartManager.js";
//import ProductManager from "../dao/fileManager/controllers/ProductManager.js";
import CartService from "../dao/mongoManager/cartManagerMongo.js";
import ProductService from "../dao/mongoManager/productManagerMongo.js";

const CartRouter = Router();

//const cart = new CartManager();
const cart = new CartService();

//const productAll = new ProductManager();
const productos = new ProductService();

//LEER
CartRouter.get("/", async (req, res) => {
  try {
    let productos = await cart.getCarts();

    res.status(202).send({
      result: "Carrito obtenido con exito",
      Carritos: productos,
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

    let carritoId = await cart.getCartsById({ _id });

    res.status(202).send({
      result: "Carrito obtenido con exito",
      carrito: carritoId,
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
    let carritoNuevo = await cart.addCarts(req.body);
    res.status(201).send(carritoNuevo);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: error, message: "No se pudo guardar el Carrito." });
  }
});

//ELIMINAR POR ID
CartRouter.delete("/:id", async (req, res) => {
  try {
    let _id = req.params.id;
    console.log(_id);

    let eliminado = await cart.getCartsById({ _id });
    await cart.deleteCart({ _id });

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

// /*==============
//   -    POST FS   -
//   ============*/
//   CartRouter.post("/:cartId/products/:productId", async (req, res) => {
//     let cartId = req.params.cartId;
//     let productId = parseInt(req.params.productId);
//     res.send(await cart.addProductToCart(cartId, productId));
//   });

//AGREGAR AL CARRITO
CartRouter.post("/:cid/products/:pid", async (req, res) => {
  try {
    let cid = req.params.cid;
    const { quantity } = req.body;
    console.log(quantity);

    const pid = req.params.pid;

    let producto = await productos.getProductbyId(pid);

    let modificado = await cart.addProductToCart(cid, {
      _id: pid,
      quantity: quantity,
    });

    res.status(202).send({
      result: "Carrito modificado con exito",
      Carritos: modificado,
    });
  } catch (error) {
    console.error("No se pudo actualizar carrito con mongoose:" + error);
    res.status(500).send({
      error: "No se pudo actualizar el carrito con mongoose",
      message: error,
    });
  }
});

export default CartRouter;
