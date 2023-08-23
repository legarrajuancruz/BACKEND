import CartsModel from "../models/carts.model.js";
import ProductService from "./productManagerMongo.js";

const productAll = new ProductService();

class CartService {
  constructor() {
    console.log("Carts with Database persistence in mongodb");
  }
  /*===============
  -   ADD Carts   -
  ================*/
  addCarts = async (product) => {
    let carts = await CartsModel.create(product);
    return carts;
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

  addProductToCart = async (cid, pid) => {
    try {
      const filter = { _id: cid, "products._id": pid };
      const cart = await CartsModel.getCartsById(cid);
      console.log("carrito en managerMongo" + cart);

      const findProduct = cart.products.some(
        (product) => product._id.toString() === pid
      );

      if (findProduct) {
        const update = { $inc: { "products.$.quantity": obj.quantity } };
      } else {
        const update = {
          $push: { products: { _id: obj._id, quantity: obj.quantity } },
        };
        await CartsModel.updateOne({ _id: cid }, update);
      }

      return await CartsModel.getCartsById(cid);
    } catch (err) {
      console.error("Error al agregar el producto al carrito:", err.message);
      return err;
    }
  };
}
export default CartService;
