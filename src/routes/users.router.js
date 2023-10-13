import { Router } from "express";
import UserController from "../controllers/users.controller.js";

const userRouter = Router();

//LEER USUARIOS
userRouter.get("/", UserController.getUsers);

//LEER USUARIOS POR ID
userRouter.get("/:id", UserController.getUsersById);

//CREAR USUARIOS
userRouter.post("/", UserController.addUser);

//ELIMINAR POR ID
userRouter.delete("/:id", UserController.getUsersById);

//AGREGAR AL CARRITO
userRouter.post("/:cid/products/:pid", UserController.addProductsToCart);

export default userRouter;
