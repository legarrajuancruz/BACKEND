import { Router } from "express";
import ProductController from "../controllers/products.controller.js";
import { uploader } from "../utils.js";

const productRouter = Router();

//LEER
productRouter.get("/", ProductController.getProduct);

//LEER ID
productRouter.get("/:id", ProductController.getProductById);

//CREAR
productRouter.post("/", uploader.single("img"), ProductController.addProduct);

//ELIMINAR
productRouter.delete("/:id", ProductController.deleteProduct);

//MODIFICAR
productRouter.put("/:id", uploader.single("img"), ProductController.modProduct);

export default productRouter;
