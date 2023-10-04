import CartService from "../dao/mongoManager/cartManagerMongo.js";
import ProductService from "../dao/mongoManager/productManagerMongo.js";

import ProductManager from "../dao/fileManager/ProductManager.js";
import CartManager from "../dao/fileManager/CartManager.js";

const cart = new CartService();
//const cart = new CartManager();

const productos = new ProductService();
//const productos = new ProductManager();

//LEER
const getCarts = async (req, res) => {
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
};

//LEER ID
const getCartsById = async (req, res) => {
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
};

//CREAR
const addCart = async (req, res) => {
  try {
    let carritoNuevo = await cart.addCarts(req.body);
    res.status(201).send(carritoNuevo);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: error, message: "No se pudo guardar el Carrito." });
  }
};

//ELIMINAR POR ID
const deleteCartById = async (req, res) => {
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
};

//AGREGAR AL CARRITO
const addProductsToCart = async (req, res) => {
  try {
    let cid = req.params.cid;
    const { quantity } = req.body;

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
};

//MODIFICAR ITEM CON ARRAY  DE PRODUCTOS
const modProductsInCart = async (req, res) => {
  console.log("BODY");
  const { body } = req;

  console.log({ body });
  const { cid } = req.params;
  try {
    const existCart = await cart.getCartsById(cid);
    console.log(existCart);

    if (!existCart) {
      return res
        .status(404)
        .send({ Status: "error", message: "Cart not found" });
    }

    body.forEach(async (item) => {
      console.log(`ITEAM ${item._id}`);

      const existProd = await productos.getProductById(item._id);

      if (!existProd) {
        return res
          .status(404)
          .send({ Status: "error", message: `Prod ${item._id} not found` });
      }
    });

    const newCart = await cart.modificarProductInCart(cid, body);
    res.status(200).send({ status: "success", newCart: newCart });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

export default {
  getCarts,
  getCartsById,
  addCart,
  deleteCartById,
  addProductsToCart,
  modProductsInCart,
};
