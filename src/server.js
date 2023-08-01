import express from "express";
import ProductManager from "./components/ProductManager.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 8080;
const server = app.listen(PORT, () => {
  console.log(`Express Server en Localhost ${PORT}`);
});

const productos = new ProductManager();
const readProducts = productos.readProducts();

app.get("/products", async (req, res) => {
  let limit = parseInt(req.query.limit);
  if (!limit) {
    return res.send(await readProducts);
  }
  let todos = await readProducts;
  let productLimit = todos.slice(0, limit);
  res.send(productLimit);
});

app.get("/products/:id", async (req, res) => {
  let id = parseInt(req.params.id);
  let todos = await readProducts;
  let productsById = todos.find((eL) => eL.id === id);
  res.send(productsById);
});
