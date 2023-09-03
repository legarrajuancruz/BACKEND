import express from "express";

import ProductManager from "../dao/mongoManager/productManagerMongo.js";
import CartService from "../dao/mongoManager/cartManagerMongo.js";

import cookieParser from "cookie-parser";

const router = express.Router();

const products = new ProductManager();
const carts = new CartService();

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
  console.log(allCarts);
  res.render("carts", { allCarts });
});

//CHAT
router.get("/chat", (req, res) => {
  res.render("messages", {});
});

/*==============
|    COOKIES   |
==============*/

router.use(cookieParser("s3cr3t"));

//con firma

// set Cookie
router.get("/setCookie", (req, res) => {
  res
    .cookie("CoderCookie", "esta es una cookie", {
      maxAge: 10000,
      signed: true,
    })
    .send("Cookie asignada con exito");
});

// get cookie
router.get("/getCookie", (req, res) => {
  res.send(req.signedCookies);
});

//delete cookie
router.get("/deleteCookie", (req, res) => {
  res.clearCookie("CoderCookie").send("Cookie borrada con exito");
});

/*===============
|    SESSIONS   |
===============*/

router.get("/login", (req, res) => {
  const { username, password } = req.query;
  if (username !== "Juan" || password !== "s3cre3t") {
    return res.status(401).send("Login fail, check user and password");
  } else {
    req.session.user = username;
    ReadableStreamBYOBRequest.session.admin = true;
    res.send("Login Success!");
  }
});

function auth(req, res, next) {
  if ((req, session.user === "Juan" && req.session.admin)) {
    return next;
  } else {
    return res.status(403).send("Usuario no autorizado a este recurso");
  }
}

router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      res.json({ error: "logout error", message: "Error al cerrar la sesion" });
    }
    res.send("Sesion cerrada coreectamente");
  });
});
export default router;
