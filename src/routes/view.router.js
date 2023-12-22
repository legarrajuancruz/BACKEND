import express from "express";
import passport from "passport";

import ProductManager from "../services/dao/mongoManager/productManagerMongo.js";
import CartService from "../services/dao/mongoManager/cartManagerMongo.js";
import UserService from "../services/dao/mongoManager/userManagerMongo.js";

import {
  productService,
  userService,
  cartService,
} from "../services/factory.js";

const router = express.Router();

const products = new ProductManager();
const carts = new CartService();
const user = new UserService();

//HOME
router.get("/", async (request, response) => {
  try {
    const getProducts = await productService.getProducts();
    response.render("home", { getProducts });
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
});

//PRODUCTS

router.get(
  "/products",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const Products = await productService.leerProductos(req.query);

    const user = req.user;
    if (user.role === "user") {
      res.render("products", { Products, user });
    } else {
      res.render("error");
    }
  }
);

//REALTIME PRODUCTS
router.get(
  "/realtimeproducts",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const allProducts = await productService.leerProductos(req.query);
    const user = req.user;
    if (user.role !== "user") {
      res.render("realtimeproducts", { allProducts, user });
    } else {
      res.render("error");
    }
  }
);

//CARTS
router.get(
  "/carts",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const userID = req.user;
    const _id = req.user.cart;
    let userCart = await cartService.getCartsById(_id);
    res.render("carts", { userCart, userID });
  }
);

//CHAT
router.get(
  "/chat",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const user = req.user;
    if (user.role === "user") {
      res.render("messages", {});
    } else {
      res.render("error");
    }
  }
);

//CERRAR SESION
router.get(
  "/cerrar",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.render("cerrar", { user: req.user });
  }
);

router.get("/profile", (req, res) => {
  res.render("profile", {
    user: req.session.user,
  });
});

//ADMIN OCULTO
router.get(
  "/admin",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const allUsers = await userService.getUsers(req.query);
    const user = req.user;
    if (user.role === "admin") {
      res.render("admin", { user, allUsers });
    } else {
      res.render("error");
    }
  }
);

export default router;
