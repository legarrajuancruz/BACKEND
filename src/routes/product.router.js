import { Router } from "express";
import ProductController from "../controllers/products.controller.js";

const productRouter = Router();

//LEER
productRouter.get("/", ProductController.getProduct);

//LEER ID
productRouter.get("/:id", ProductController.getProductById);

//CREAR
productRouter.post("/", ProductController.addProduct);

//ELIMINAR
productRouter.delete("/:id", ProductController.deleteProduct);

//MODIFICAR
productRouter.put("/:id", ProductController.modProduct);

export default productRouter;
