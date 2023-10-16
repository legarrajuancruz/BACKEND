import { Router } from "express";
import UserController from "../controllers/users.controller.js";

const UserRouter = Router();

//LEER USUARIOS
UserRouter.get("/", UserController.leerUsuarios);

//LEER USUARIOS POR ID
UserRouter.get("/:id", UserController.ControlgetUsersById);

// //CREAR USUARIOS
// UserRouter.post("/", UserController.addUser);

// //ELIMINAR POR ID
// UserRouter.delete("/:id", UserController.getUsersById);

// //AGREGAR AL CARRITO
UserRouter.post("/:uid/products/:pid", UserController.agregaralCarritoUser);

export default UserRouter;
