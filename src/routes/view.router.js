import express from "express";
import passport from "passport";

import ProductManager from "../services/dao/mongoManager/productManagerMongo.js";
import CartService from "../services/dao/mongoManager/cartManagerMongo.js";

const router = express.Router();

const products = new ProductManager();
const carts = new CartService();

//HOME
router.get("/", async (request, response) => {
  try {
    const getProducts = await products.leerProductos(request.query);
    response.render("login", { getProducts });
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
});

//PRODUCTS
router.get("/products", async (req, res) => {
  const Products = await products.leerProductos(req.query);
  const user = req.session.user;
  res.render("products", { Products, user });
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
router.get(
  "/chat",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.render("messages", {});
  }
);

export default router;
