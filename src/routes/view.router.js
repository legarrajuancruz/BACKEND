import express from "express";
import ProductManager from "../dao/mongoManager/productManagerMongo.js";

const router = express.Router();
const products = new ProductManager();

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
  let allProducts = await products.leerProductos(request.query);
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
