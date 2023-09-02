import express from "express";
import ProductManager from "../dao/mongoManager/productManagerMongo.js";
import CartService from "../dao/mongoManager/cartManagerMongo.js";

const router = express.Router();
const products = new ProductManager();
const carts = new CartService();

router.get("/", async (request, response) => {
  try {
    const getProducts = await products.leerProductos(request.query);
    response.render("home", { getProducts });
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
});

//REALTIME PRODUCTS
router.get("/realtimeproducts", async (req, res) => {
  const allProducts = await products.leerProductos(req.query);

  res.render("realtimeproducts", { allProducts });
});

//PRODUCTS
router.get("/products", async (req, res) => {
  const Products = await products.leerProductos(req.query);

  res.render("products", { Products });
});

//CARTS
router.get("/carts", async (req, res) => {
  let allCarts = await carts.getCarts(req.query);
  console.log(allCarts);
  res.render("carts", { allCarts });
});

router.get("/chat", (req, res) => {
  res.render("messages", {});
});

export default router;
