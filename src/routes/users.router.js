import { Router } from "express";
import { uploader } from "../utils.js";
import UserController from "../controllers/users.controller.js";

const UserRouter = Router();

//LEER USUARIOS
UserRouter.get("/", UserController.ControlgetUsers);

//LEER USUARIOS POR ID
UserRouter.get("/:id", UserController.ControlgetUsersById);

//VISTA ADMIN DE USUARIO SELECCIONADO
UserRouter.get("/:id/view", UserController.ControlViewUserById);

//CAMBIAR ROL
UserRouter.post("/:id", UserController.ControlchangeRol);

//ELIMINAR USUARIOS INACTIVOS
UserRouter.delete("/", UserController.deleteInactive);

//ELIMINAR POR ID
UserRouter.delete("/:id", UserController.ControlDeleteUserID);

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

//ENVIAR EMAIL RECUPERAR PASSWORD
UserRouter.post("/resetPassword/:email", UserController.ControlresetPassword);

//ASIGNAR NUEVA PASSWORD
UserRouter.post("/nuevaPassord/nueva", UserController.ControlnuevaPassword);

export default UserRouter;
