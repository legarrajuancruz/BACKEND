import { Router } from "express";
import { uploader } from "../utils.js";
import UserController from "../controllers/users.controller.js";
const UserRouter = Router();

//LEER USUARIOS
UserRouter.get("/", UserController.ControlgetUsers);

//LEER USUARIOS POR ID
UserRouter.get("/:id", UserController.ControlgetUsersById);

// //ELIMINAR POR ID
// UserRouter.delete("/:id", UserController.getUsersById);

//SUBIR DOCUMENTOS
UserRouter.post(
  "/:uid/documents",
  uploader.fields([
    { name: "profiles", maxCount: 1 },
    { name: "document", maxCount: 1 },
  ]),
  UserController.handleProfileUpload
);

//SER PREMIUM
UserRouter.post(
  "/premium/:uid",
  uploader.fields([
    { name: "identificationDocument", maxCount: 1 },
    { name: "domicileDocument", maxCount: 1 },
    { name: "accountStatementDocument", maxCount: 1 },
  ]),
  UserController.handlePremium
);

UserRouter.post("/cambiarPassword", UserController.resetPassword);
UserRouter.post("/nuevaPassord", UserController.nuevaPassword);

export default UserRouter;
