import express from "express";
import ProductManager from "../dao/mongoManager/productManagerMongo.js";

const router = express.Router();
const products = new ProductManager();

router.get("/", async (req, res) => {
  let allProducts = await products.leerProductos();

  res.render("home", { allProducts });
});

router.get("/realtimeproducts", async (req, res) => {
  let allProducts = await products.leerProductos();
  let { title, description, price, stock } = allProducts;

  res.render("realtimeproducts", {
    title: "Listado de productos - handlebars",
    products: allProducts,
  });
});

router.get("/products", async (req, res) => {
  let allProducts = await products.leerProductos();
  res.render("products", {
    title: "Listado de productos - handlebars",
    products: { allProducts },
  });
});

router.get("/chat", (req, res) => {
  res.render("messages", {});
});

export default router;
