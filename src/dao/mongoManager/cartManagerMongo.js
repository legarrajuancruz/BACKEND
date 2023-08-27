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
    const cart = await CartsModel.findById(id);
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
        (product) => product._id.toString() === obj._id
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

      return await cartModel.findById(cid);
    } catch (error) {
      console.error(`Error al agregar  el producto al carrito`, error.nessage);
    }
  };
}

export default CartService;
