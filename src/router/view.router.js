import express from "express";
const router = express.Router();
import ProductManager from "../controllers/ProductManager.js";

const products = new ProductManager();

router.get("/", async (req, res) => {
  let allProducts = await products.getProducts();
  res.render("home", {
    title: "Listado de productos - handlebars",
    products: allProducts,
  });
});

router.get("/realtimeproducts", async (req, res) => {
  let allProducts = await products.getProducts();
  res.render("realtimeproducts", {
    title: "Listado de productos - handlebars",
    products: allProducts,
  });
});

export default router;
