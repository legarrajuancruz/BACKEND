import express from "express";
import { Router } from "express";
import UserManager from "../dao/mongoManager/userManagerMongo.js";

const SessionsRouter = Router();

const UM = new UserManager();

SessionsRouter.get("/login", async (req, res) => {
  let { user, pass } = req.query;
  const userLogged = await UM.login(user, pass);

  if (userLogged) {
    res.send({ status: "Success", message: userLogged });
  } else {
    res
      .status(401)
      .send({ status: "Error", message: "No se pude loguear el usuario" });
  }
});

SessionsRouter.post("/register", async (req, res) => {
  const userRegistered = await UM.crearUsuario(req.query);

  if (userRegistered) {
    res.send({ status: "Success", message: userRegistered });
  } else {
    res
      .status(401)
      .send({ status: "Error", message: "No se pude registrar el usuario" });
  }
});

export default SessionsRouter;
