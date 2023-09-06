import express from "express";

import ProductManager from "../dao/mongoManager/productManagerMongo.js";
import CartService from "../dao/mongoManager/cartManagerMongo.js";
import UserService from "../dao/mongoManager/userManagerMongo.js";

const router = express.Router();

const products = new ProductManager();
const carts = new CartService();
const user = new UserService();

//HOME
router.get("/", async (request, response) => {
  try {
    const getProducts = await products.leerProductos(request.query);
    response.render("home", { getProducts });
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
});

//PRODUCTS
router.get("/products", async (req, res) => {
  const Products = await products.leerProductos(req.query);

  res.render("products", { Products });
});

//REALTIME PRODUCTS
router.get("/realtimeproducts", async (req, res) => {
  const allProducts = await products.leerProductos(req.query);
  res.render("realtimeproducts", { allProducts });
});

//CARTS
router.get("/carts", async (req, res) => {
  let allCarts = await carts.getCarts(req.query);
  res.render("carts", { allCarts });
});

//CHAT
router.get("/chat", (req, res) => {
  res.render("messages", {});
});

export default router;
