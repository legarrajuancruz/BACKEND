import { CartsModel } from "../models/carts.model.js";

import ProductService from "./productManagerMongo.js";

const PS = new ProductService();

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
    if (cart) {
      const productsDetails = await Promise.all(
        cart.products.map(async (product) => {
          const productDetails = await PS.getProductbyId(product._id);
          return {
            _id: productDetails._id,
            quantity: product.quantity,
            product: {
              title: productDetails.title,
              price: productDetails.price,
              category: productDetails.category,
              img: productDetails.img,
            },
          };
        })
      );

      cart.products = productsDetails;
    }

    return cart;
  };

  /*==================
  -  DELETE CART ID  -
  ==================*/
  deleteCart = async (id) => {
    const result = await CartsModel.deleteOne(id);
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

  modificarProductInCart = async (cid, body) => {
    try {
      console.log(body);
      //A partir de los datos, buscar por idx los productos para obtener su _id para generar el populate
      const arr = [];
      for (const item of body) {
        const object = await PS.getProductbyId(item._id);
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

      const updateCart = await CartsModel.findOneAndUpdate(filter, update, {
        new: true,
      });
      return updateCart;
    } catch (err) {
      console.log(err.message);
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
