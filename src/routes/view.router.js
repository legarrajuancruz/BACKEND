import express from "express";
import ProductManager from "../dao/mongoManager/productManagerMongo.js";

const router = express.Router();
const products = new ProductManager();

// HOME
router.get("/", async (req, res) => {
  const allProducts = await products.leerProductos();

  res.render("home", allProducts);
});

//REALTIME PRODUCTS
router.get("/realtimeproducts", async (req, res) => {
  const allProducts = await products.leerProductos();

  res.render("realtimeproducts", { allProducts });
});

//PRODUCTS
router.get("/products", async (req, res) => {
  const Products = await products.leerProductos();

  res.render("products", { Products });
});

//CARTS
router.get("/carts", async (req, res) => {
  let allProducts = await products.leerProductos();
  console.log(allProducts);
  res.render("carts", {
    title: "Listado de productos - handlebars",
    products: { allProducts },
  });
});

router.get("/chat", (req, res) => {
  res.render("messages", {});
});

export default router;
