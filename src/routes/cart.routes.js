import { Router } from "express";
//import CartManager from "../dao/fileManager/controllers/CartManager.js";
import CartService from "../dao/mongoManager/cartManagerMongo.js";
import ProductManager from "../dao/mongoManager/productManagerMongo.js";

//const cart = new CartManager();

const CartRouter = Router();
const cartService = new CartService();
//const pm = new ProductManager();

//FileSystem

// /*============
//  -     GET    -
//  ============*/
// CartRouter.get(`/`, async (req, res) => {
//   res.send(await cart.readCarts());
// });

// /*==============
//   -    POST    -
//   ============*/
// CartRouter.post("/", async (req, res) => {
//   let newCart = req.body;
//   res.send(await cart.addCarts(newCart));
// });

// /*==============
//   -   GET ID   -
//   ============*/
// CartRouter.get(`/:id`, async (req, res) => {
//   let id = req.params.id;
//   res.send(await cart.getCartsById(id));
// });

// /*==============
//   -    POST    -
//   ============*/
// CartRouter.post("/:cartId/products/:productId", async (req, res) => {
//   let cartId = req.params.cartId;
//   let productId = parseInt(req.params.productId);
//   res.send(await cart.addProductToCart(cartId, productId));
// });

/*==============
| MongoManager |
==============*/

//LEER
CartRouter.get("/", async (req, res) => {
  try {
    let products = await cartService.getAll();
    res.send(products);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: error, message: "No se pudo obtener el producto." });
  }
});

//LEER ID
CartRouter.get("/:id", async (req, res) => {
  try {
    let _id = req.params.id;
    console.log(_id);

    let producto = await cartService.getProductbyId({ _id });

    res.status(202).send({
      result: "Producto obtenido con exito",
      producto: producto,
    });
  } catch (error) {
    console.error("No se pudo obtener producto con mongoose:" + error);
    res.status(500).send({
      error: "No se pudo obtener el producto con mongoose",
      message: error,
    });
  }
});

//CREAR
CartRouter.post("/", async (req, res) => {
  try {
    let producto = await cartService.save(req.body);
    res.status(201).send(producto);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: error, message: "No se pudo guardar el producto." });
  }
});

//ELIMINAR
CartRouter.delete("/:id", async (req, res) => {
  try {
    let _id = req.params.id;
    console.log(_id);

    let eliminado = await cartService.getProductbyId({ _id });
    await productService.deleteOne({ _id });

    res.status(202).send({
      result: "Producto eliminado con exito",
      producto: eliminado,
    });
  } catch (error) {
    console.error("No se pudo obtener producto con mongoose:" + error);
    res.status(500).send({
      error: "No se pudo eliminar el producto con mongoose",
      message: error,
    });
  }
});

//MODIFICAR
CartRouter.put("/:id", async (req, res) => {
  try {
    let productUpdated = req.body;

    let productoActualizado = await cartService.updateProduct(
      req.params.id,
      productUpdated
    );

    res.status(202).send({
      result: "Producto modificado con exito",
      payload: productoActualizado,
    });
  } catch (error) {
    console.error("No se pudo actualizar usuario con mongoose:" + error);
    res.status(500).send({
      error: "No se pudo actualizar el usuario con mongoose",
      message: error,
    });
  }
});

export default CartRouter;
