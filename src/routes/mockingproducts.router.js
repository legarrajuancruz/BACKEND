import { Router } from "express";
import ProductController from "../controllers/products.controller.js";

const ProductMockup = Router();

//LEER
ProductMockup.get("/", ProductController.getProductMockup);

export default ProductMockup;
