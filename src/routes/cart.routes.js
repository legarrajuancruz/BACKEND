import { Router } from "express";
//import CartManager from "../dao/fileManager/controllers/CartManager.js";
//import ProductManager from "../dao/fileManager/controllers/ProductManager.js";
import CartService from "../dao/mongoManager/cartManagerMongo.js";
import ProductService from "../dao/mongoManager/productManagerMongo.js";
import { CartsModel } from "../dao/models/carts.model.js";

const CartRouter = Router();

//const cart = new CartManager();
const cart = new CartService();

//const productAll = new ProductManager();
const productAll = new ProductService();

//LEER
CartRouter.get("/", async (req, res) => {
  try {
    let productos = await cart.getCarts();

    res.status(202).send({
      result: "Carrito obtenido con exito",
      products: productos,
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
    let carro = req.body;
    let carritoNuevo = await cart.addCarts(carro);
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

// /*==============
//   -    POST FS   -
//   ============*/
//   CartRouter.post("/:cartId/products/:productId", async (req, res) => {
//     let cartId = req.params.cartId;
//     let productId = parseInt(req.params.productId);
//     res.send(await cart.addProductToCart(cartId, productId));
//   });

//AGREGAR AL CARRITO
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
// CartRouter.post("/:cid/products/:pid", async (req, res) => {
//   const cid = req.params.cid;
//   console.log("cart ID" + cid);

//   const pid = req.params.pid;
//   console.log("product ID" + pid);

//   const { quantity } = 1;

//   try {
//     const checkIdProduct = await productAll.getProductById(pid);
//     console.log(checkIdProduct);
//     if (!checkIdProduct) {
//       return res
//         .status(404)
//         .send({ message: `Producto con ID: ${pid} no fue encontrado` });
//     }

//     const checkIdCart = await cart.getCartsById(cid);
//     console.log(checkIdCart);
//     if (!checkIdCart) {
//       return res
//         .status(404)
//         .send({ message: `Carrito con ID: ${cid} no fue encontrado` });
//     }

//     const result = await cart.addProductToCart(cid, {
//       _id: pid,
//       quantity: quantity,
//     });
//     return res.status(200).send({
//       message: `Producto con ID: ${pid} fue agregado al carito con ID: ${cid}`,
//       cart: result,
//     });
//   } catch (error) {
//     console.error("No se pudo actualizar carrito con mongoose:" + error);
//     res.status(500).send({
//       error: "No se pudo actualizar el carrito con mongoose",
//       message: error,
//     });
//   }
// });

export default CartRouter;
