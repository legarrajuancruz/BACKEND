import CartsModel from "../models/carts.model.js";
import ProductService from "./productManagerMongo.js";

const pm = new ProductService();

class CartService {
  constructor() {
    console.log("Carts with Database persistence in mongodb");
  }
  /*===============
  -   ADD Carts   -
  ================*/
  //   addCarts = async (carritoNuevo) => {
  //     let cart = await CartsModel.create(carritoNuevo);
  //     return cart;
  //   };

  addCart = async (products) => {
    try {
      let cartData = {};
      if (products && products.length > 0) {
        cartData.products = products;
      }

      const cart = await cartModel.create(cartData);
      return cart;
    } catch (err) {
      console.error("Error al crear el carrito:", err.message);
      return err;
    }
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

  //   addProductToCart = async (cid, pid) => {
  //     try {
  //       const filter = { _id: cid, "products._id": pid };
  //       const cart = await CartsModel.getCartsById(cid);
  //       console.log("carrito en managerMongo" + cart);

  //       const findProduct = cart.products.some(
  //         (product) => product._id.toString() === pid
  //       );

  //       if (findProduct) {
  //         const update = { $inc: { "products.$.quantity": obj.quantity } };
  //       } else {
  //         const update = {
  //           $push: { products: { _id: obj._id, quantity: obj.quantity } },
  //         };
  //         await CartsModel.updateOne({ _id: cid }, update);
  //       }

  //       return await CartsModel.getCartsById(cid);
  //     } catch (err) {
  //       console.error("Error al agregar el producto al carrito:", err.message);
  //       return err;
  //     }
  //   };
  addProductInCart = async (cid, obj) => {
    try {
      const filter = { _id: cid, "products._id": obj._id };
      const cart = await CartsModel.findById(cid);
      const findProduct = cart.products.some(
        (product) => product._id.toString() === obj._id
      );

      if (findProduct) {
        const update = { $inc: { "products.$.quantity": obj.quantity } };
        await CartsModel.updateOne(filter, update);
      } else {
        const update = {
          $push: { products: { _id: obj._id, quantity: obj.quantity } },
        };
        await CartsModel.updateOne({ _id: cid }, update);
      }

      return await CartsModel.findById(cid);
    } catch (err) {
      console.error("Error al agregar el producto al carrito:", err.message);
      return err;
    }
  };
}
export default CartService;
