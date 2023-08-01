import express from "express";
const router = express.Router();
import ProductManager from "../controllers/ProductManager.js";

const products = new ProductManager();

// router.get("/", (req, res) => {
//   res.render("index", {});
// });

router.get("/", async (req, res) => {
  let allProducts = await products.getProducts();
  console.log(allProducts);
  res.render("home", {
    title: "Listado de productos - handlebars",
    products: allProducts,
  });
});

export default router;
