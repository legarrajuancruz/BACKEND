import { productService, cartService } from "../services/factory.js";

/*===============
  -   ADD Carts   -
  ================*/
const addCart = async (req, res) => {
  try {
    let carritoNuevo = await cartService.addCarts();
    res.status(201).send(carritoNuevo);
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
    let _id = req.params.id;
    console.log(_id);

    let eliminado = await cartService.getCartsById({ _id });
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
};

/*==========================
  -   ADD Products to Cart   -
  ==========================*/
const addProductsToCart = async (req, res) => {
  try {
    let cid = req.params.cid;
    const { quantity } = req.body;

    const pid = req.params.pid;

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

    body.forEach(async (item) => {
      console.log(`ITEAM ${item._id}`);

      const existProd = await productService.getProductById(item._id);

      if (!existProd) {
        return res
          .status(404)
          .send({ Status: "error", message: `Prod ${item._id} not found` });
      }
    });

    const newCart = await cartService.modificarProductInCart(cid, body);
    res.status(200).send({ status: "success", newCart: newCart });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

/*==========================
  -   DELETE Products to Cart   -
  ==========================*/

const borrarProductoEnCarrito = async (cid, pid) => {
  try {
    const cart = await cartService.deleteProductToCart(cid, pid);
    return cart;
  } catch (error) {
    console.error(`Error al borrar  el producto del carrito`, error.nessage);
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
