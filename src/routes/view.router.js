import express from "express";
import passport from "passport";

import ProductManager from "../services/dao/mongoManager/productManagerMongo.js";
import CartService from "../services/dao/mongoManager/cartManagerMongo.js";
import userService from "../services/dao/mongoManager/userManagerMongo.js";
import UserService from "../services/dao/mongoManager/userManagerMongo.js";

const router = express.Router();

const products = new ProductManager();
const carts = new CartService();
const user = new UserService();

//HOME
router.get("/", async (request, response) => {
  try {
    const getProducts = await products.leerProductos(req.query);
    response.render("login", { getProducts });
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
});

//PRODUCTS
router.get(
  "/products",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const Products = await products.leerProductos(req.query);

    const user = req.user;
    res.render("products", { Products, user });
  }
);

//REALTIME PRODUCTS
router.get("/realtimeproducts", async (req, res) => {
  const allProducts = await products.leerProductos(req.query);
  res.render("realtimeproducts", { allProducts });
});

//CARTS
router.get(
  "/carts",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    let allCarts = await carts.getCarts(req.query);
    res.render("carts", { allCarts });
  }
);

//CHAT
router.get(
  "/chat",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.render("messages", {});
  }
);

export default router;
