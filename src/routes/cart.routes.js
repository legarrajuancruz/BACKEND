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

//LEER
CartRouter.get("/", async (req, res) => {
  try {
    let producto = await cart.getCarts();

    res.status(202).send({
      result: "Carrito obtenido con exito",
      carritos: producto,
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
      carrito: producto,
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

//AGREGAR AL CARRITO
CartRouter.post("/:cid/products/:pid", async (req, res) => {
  const cid = req.params.cid;
  console.log("cart ID" + cid);

  const pid = req.params.pid;
  console.log("product ID" + pid);

  const { quantity } = 1;

  try {
    const checkIdProduct = await productAll.getProductById(pid);
    console.log(checkIdProduct);
    if (!checkIdProduct) {
      return res
        .status(404)
        .send({ message: `Producto con ID: ${pid} no fue encontrado` });
    }

    const checkIdCart = await cart.getCartsById(cid);
    console.log(checkIdCart);
    if (!checkIdCart) {
      return res
        .status(404)
        .send({ message: `Carrito con ID: ${cid} no fue encontrado` });
    }

    const result = await cart.addProductToCart(cid, {
      _id: pid,
      quantity: quantity,
    });
    return res.status(200).send({
      message: `Producto con ID: ${pid} fue agregado al carito con ID: ${cid}`,
      cart: result,
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
