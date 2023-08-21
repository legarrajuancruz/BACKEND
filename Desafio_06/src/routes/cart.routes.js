import { Router } from "express";
import CartManager from "../dao/fileManager/controllers/CartManager.js";

const CartRouter = Router();
const cart = new CartManager();

/*============
 -     GET    -
 ============*/
CartRouter.get(`/`, async (req, res) => {
  res.send(await cart.readCarts());
});

/*==============
  -    POST    -
  ============*/
CartRouter.post("/", async (req, res) => {
  let newCart = req.body;
  res.send(await cart.addCarts(newCart));
});

/*==============
  -   GET ID   -
  ============*/
CartRouter.get(`/:id`, async (req, res) => {
  let id = req.params.id;
  res.send(await cart.getCartsById(id));
});

/*==============
  -    POST    -
  ============*/
CartRouter.post("/:cartId/products/:productId", async (req, res) => {
  let cartId = req.params.cartId;
  let productId = parseInt(req.params.productId);
  res.send(await cart.addProductToCart(cartId, productId));
});

export default CartRouter;
