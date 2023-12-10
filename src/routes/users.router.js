import { Router } from "express";
import { uploader } from "../utils.js";
import UserController from "../controllers/users.controller.js";
const UserRouter = Router();

//LEER USUARIOS
UserRouter.get("/", UserController.leerUsuarios);

//LEER USUARIOS POR ID
UserRouter.get("/:id", UserController.ControlgetUsersById);

// //ELIMINAR POR ID
// UserRouter.delete("/:id", UserController.getUsersById);

UserRouter.post(
  "/premium/:uid",
  uploader.fields([
    { name: "profiles", maxCount: 1 },
    { name: "products", maxCount: 1 },
    { name: "document", maxCount: 1 },
  ]),
  UserController.handlePremiumUpload
);

// //AGREGAR AL CARRITO
UserRouter.post("/:uid/products/:pid", UserController.agregaralCarritoUser);

UserRouter.post("/cambiarPassword", UserController.resetPassword);
UserRouter.post("/nuevaPassord", UserController.nuevaPassword);

export default UserRouter;
