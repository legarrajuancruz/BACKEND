import { Router } from "express";
import CartService from "../dao/mongoManager/cartManagerMongo.js";
import ProductService from "../dao/mongoManager/productManagerMongo.js";
import { uploader } from "../utils.js";

const CartRouter = Router();

const cart = new CartService();

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

//AGREGAR AL CARRITO
CartRouter.post("/:cid/products/:pid", async (req, res) => {
  try {
    let cid = req.params.cid;
    const { quantity } = req.body;
    console.log(quantity);

    const pid = req.params.pid;

    let producto = await productos.getProductbyId(pid);

    let modificado = await cart.addProductToCart(cid.toString(), {
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

//MODIFICAR PRODUCTO EN CARRITO
CartRouter.put(
  "/:cid/products/:pid",
  uploader.single("file"),
  async (req, res) => {
    try {
      let cid = req.params.cid;
      const pid = req.params.pid;

      let product = req.body;
      product.img = req.file.path;
      // console.log(product);

      let producto = await productos.getProductbyId(pid);

      let modificado = await cart.modificarProductInCart(cid.toString(), {
        product,
      });

      res.status(202).send({
        result: "Producto en carrito modificado con exito",
        // ProductoModificado: modificado.products._id,
        modificado,
      });
    } catch (error) {
      console.error("No se pudo actualizar el producto en carrito:" + error);
      res.status(500).send({
        error: "No se pudo actualizar el carrito con mongoose",
        message: error,
      });
    }
  }
);

//BORRAR DEL CARRITO
CartRouter.delete("/:cid/products/:pid", async (req, res) => {
  try {
    let cid = req.params.cid;

    const pid = req.params.pid;

    let producto = await productos.getProductbyId(pid);

    let modificado = await cart.deleteProductToCart(cid, pid);

    res.status(202).send({
      result: "Producto eliminado del carrito",
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
