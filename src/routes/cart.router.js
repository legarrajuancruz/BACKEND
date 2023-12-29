import { Router } from "express";
import CartController from "../controllers/carts.controller.js";

const CartRouter = Router();

//LEER
CartRouter.get("/", CartController.getCarts);

//LEER ID
CartRouter.get("/:id", CartController.getCartsById);

//CREAR
CartRouter.post("/", CartController.addCart);

//ELIMINAR POR ID
CartRouter.delete("/:id", CartController.deleteCartById);

//AGREGAR AL CARRITO
CartRouter.post("/:cid/products/:pid", CartController.addProductsToCart);

//MODIFICAR ITEM CON ARRAY  DE PRODUCTOS
CartRouter.put("/:cid", CartController.modProductsInCart);

//ELIMINAR PRODUCTOS EN CARRITO
CartRouter.delete(
  "/:cid/products/:pid",
  CartController.borrarProductoEnCarrito
);

export default CartRouter;
