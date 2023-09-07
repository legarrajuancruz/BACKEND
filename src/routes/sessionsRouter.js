import { Router } from "express";
import UserManager from "../dao/mongoManager/userManagerMongo.js";

const SessionsRouter = Router();

const UM = new UserManager();

SessionsRouter.get("/login", async (req, res) => {
  let { user, pass } = req.query;

  const userLogged = await UM.login(user, pass);

  if (userLogged) {
    res.send({ status: "OK", message: userLogged });
  } else {
    res
      .status(401)
      .send({ status: "Error", message: "No se pudo loguaer el usuario" });
  }
});

SessionsRouter.post("/register", async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;

  const exist = await UM.leerUsuarios(email);

  if (exist) {
    return res
      .status(400)
      .send({ status: "error", message: "Usuario ya registrado" });
  }

  const user = {
    first_name,
    last_name,
    email,
    age,
    password,
  };

  const result = await UM.crearUsuario(user);
  console.log(result);
  res.send({ status: "success", messgae: "Usuario creado con exito!" });
});

export default SessionsRouter;
