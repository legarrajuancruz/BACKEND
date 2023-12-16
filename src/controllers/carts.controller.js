import { productService, cartService } from "../services/factory.js";

/*===============
  -   ADD Carts   -
  ================*/
const addCart = async (req, res) => {
  try {
    let carritoNuevo = await cartService.addCarts();
    res.status(201).send({
      result: "Carrito creado con exito",
      carrito: carritoNuevo,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: error, message: "No se pudo guardar el Carrito." });
  }
};
/*==============
  -   GET Carts  -
  ===============*/
const getCarts = async (req, res) => {
  try {
    let productos = await cartService.getCarts();

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
};
/*================
  -   GET Carts ID  -
  ==================*/
const getCartsById = async (req, res) => {
  try {
    let _id = req.params.id;
    console.log(_id);

    let carritoId = await cartService.getCartsById({ _id });

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
};
/*==================
  -  DELETE CART ID  -
  ==================*/
const deleteCartById = async (req, res) => {
  try {
    let { cid } = req.params.id;
    console.log(cid);

    let eliminado = await cartService.deleteCart(cid);

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
};

/*==========================
  -   ADD Products to Cart   -
  ==========================*/
const addProductsToCart = async (req, res) => {
  try {
    let cid = req.params.cid || req.body.cid;
    const { quantity } = req.body;
    const pid = req.params.pid || req.body.cid;

    let producto = await productService.getProductbyId(pid);

    let modificado = await cartService.addProductToCart(cid.toString(), {
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
};

/*===============================
  -   MODIFICAR Products en Cart  -
  ================================*/
const modProductsInCart = async (req, res) => {
  console.log("BODY");
  const { body } = req;

  console.log({ body });
  const { cid } = req.params;

  try {
    const existCart = await cartService.getCartsById(cid);
    console.log(existCart);

    if (!existCart) {
      return res
        .status(404)
        .send({ Status: "error", message: "Cart not found" });
    }

    for (const item of body) {
      console.log(`ITEM ${item._id}`);
      const existProd = await productService.getProductbyId(item._id);

      if (!existProd) {
        return res
          .status(404)
          .send({ Status: "error", message: `Prod ${item._id} not found` });
      }
    }
    console.log("SALIO");

    const newCart = await cartService.modificarProductInCart(cid, body);
    res.status(200).send({ status: "success", newCart: newCart });
  } catch (err) {
    console.log(err.message);
    throw { status: "500", message: err.message };
  }
};

/*==========================
  -   DELETE Products in Cart   -
  ==========================*/

const borrarProductoEnCarrito = async (req, res) => {
  try {
    let cid = req.params;
    let pid = req.params;

    const cart = await cartService.deleteProductInCart(cid, pid);

    res.status(202).send({
      result: "Carrito modificado con exito",
      Carrito: { cart },
    });
  } catch (error) {
    console.error(`Error al borrar  el producto del carrito`, error.nessage);
    res.status(500).send(`Error al borrar  el producto del carrito`);
  }
};

export default {
  getCarts,
  getCartsById,
  addCart,
  deleteCartById,
  addProductsToCart,
  modProductsInCart,
  borrarProductoEnCarrito,
};
