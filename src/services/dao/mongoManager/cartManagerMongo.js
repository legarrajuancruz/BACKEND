import { CartsModel } from "../models/carts.model.js";
import userModel from "../models/user.model.js";

import ProductService from "./productManagerMongo.js";

class CartService {
  constructor() {
    console.log("Carts with Database persistence in mongodb");
  }
  /*===============
  -   ADD Carts   -
  ================*/
  addCarts = async () => {
    let cart = await userModel.create();
    return cart;
  };

  /*==============
  -   GET Carts  -
  ===============*/
  getCarts = async () => {
    let cart = await userModel.find();
    return cart;
  };

  /*================
  -   GET Carts ID  -
  ==================*/
  getCartsById = async (id) => {
    const cart = await userModel.findById(id);
    return cart;
  };

  /*==================
  -  DELETE CART ID  -
  ==================*/
  deleteCart = async (id) => {
    const result = await userModel.deleteOne(id);
    return result;
  };

  /*===============================
  -   ADD Products to User Cart   -
  ===============================*/

  addProductToCart = async (uid, obj) => {
    try {
      console.log("INFO EN USER CART");
      console.log(uid);
      console.log({ obj });
      const { _id, quantity } = obj;

      const filter = { _id: uid, "product._id": _id };
      console.log("IMPRIMO EL FILTER");
      console.log(filter);

      const userCart = await userModel.findById(uid);
      console.log("IMPRIMO EL CART");
      console.log(userCart);

      const findProduct = userCart.products.some(
        (product) => product._id.toString() === _id
      );

      if (findProduct) {
        const update = { $inc: { "products.$.quantity": quantity } };
        await userModel.updateOne(filter, update);
      } else {
        const update = {
          $push: { products: { _id: obj._id, quantity: quantity } },
        };

        await userModel.updateOne({ _id: uid }, update);
      }
      userCart = await userModel.findById(uid);
      console.log(userCart);
      return userCart;
    } catch (error) {
      console.error(`Error al agregar  el producto al carrito`, error.nessage);
    }
  };

  /*===============================
  -   MODIFICAR Products en Cart  -
  ================================*/

  modificarProductInCart = async (cid, body) => {
    try {
      console.log(body);
      //A partir de los datos, buscar por idx los productos para obtener su _id para generar el populate
      const arr = [];
      for (const item of body) {
        const object = await ProductService.getProductById(item._id);
        arr.push({
          _id: item._id,
          quantity: item.quantity,
          product: object._id,
        });
      }
      console.log(arr);

      // Filtrar por el índice del carrito
      const filter = { _id: cid };
      // Actualizar con los nuevos datos
      const update = { $set: { products: arr } };

      const updateCart = await userModel.findOneAndUpdate(filter, update, {
        new: true,
      });
      return updateCart;
    } catch (err) {
      console.log(err.message);
    }
  };

  /*==========================
  -   DELETE Products in Cart   -
  ==========================*/

  deleteProductInCart = async ({ cid, pid }) => {
    try {
      const carritoEncontrado = await userModel.findById(cid);
      console.log(carritoEncontrado);

      const cart = await userModel.findByIdAndUpdate(cid, {
        $pull: { products: { _id: pid } },
      });

      return cart;
    } catch (error) {
      console.error(`Error al borrar  el producto del carrito`, error.nessage);
    }
  };
}

export default CartService;
