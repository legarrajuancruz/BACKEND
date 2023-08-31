import { CartsModel } from "../models/carts.model.js";

class CartService {
  constructor() {
    console.log("Carts with Database persistence in mongodb");
  }
  /*===============
  -   ADD Carts   -
  ================*/
  addCarts = async (carritoNuevo) => {
    let cart = await CartsModel.create(carritoNuevo);
    return cart;
  };

  /*==============
  -   GET Carts  -
  ===============*/
  getCarts = async () => {
    let cart = await CartsModel.find();
    return cart;
  };

  /*================
  -   GET Carts ID  -
  ==================*/
  getCartsById = async (id) => {
    const cart = await CartsModel.findById(id).lean();
    return cart;
  };

  /*==================
  -  DELETE CART ID  -
  ==================*/
  deleteCart = async (id) => {
    let result = await CartsModel.deleteOne(id);
    return result;
  };

  /*==========================
  -   ADD Products to Cart   -
  ==========================*/

  addProductToCart = async (cid, obj) => {
    try {
      const { _id, quantity } = obj;

      const filter = { _id: cid, "products._id": _id };

      const cart = await CartsModel.findById(cid);
      const findProduct = cart.products.some(
        (product) => product._id.toString() === _id
      );

      if (findProduct) {
        const update = { $inc: { "products.$.quantity": quantity } };
        await CartsModel.updateOne(filter, update);
      } else {
        const update = {
          $push: { products: { _id: obj._id, quantity: quantity } },
        };
        await CartsModel.updateOne({ _id: cid }, update);
      }

      return await CartsModel.findById(cid);
    } catch (error) {
      console.error(`Error al agregar  el producto al carrito`, error.nessage);
    }
  };

  /*===============================
  -   MODIFICAR Products en Cart  -
  ================================*/

  modificarProductInCart = async (cid, obj) => {
    try {
      const { _id } = obj;

      const filter = { _id: cid, "products._id": _id };

      const cart = await CartsModel.findById(cid);
      const findProduct = cart.products.some(
        (product) => product._id.toString() === _id
      );

      if (findProduct) {
        const update = { $set: { products: { _id: cid, product } } };
        await CartsModel.updateOne(filter, update);
      }

      let result = await CartsModel.findById(cid);

      console.log(result);

      return update;
    } catch (error) {
      console.error(`Error al agregar  el producto al carrito`, error.nessage);
    }
  };

  /*==========================
  -   DELETE Products to Cart   -
  ==========================*/

  deleteProductToCart = async (cid, pid) => {
    try {
      const cart = await CartsModel.findByIdAndUpdate(cid, {
        $pull: { products: { _id: pid } },
      });

      return await CartsModel.findById(cart);
    } catch (error) {
      console.error(`Error al borrar  el producto del carrito`, error.nessage);
    }
  };
}

export default CartService;
