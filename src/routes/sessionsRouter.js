import { Router } from "express";
import UserManager from "../dao/mongoManager/userManagerMongo.js";

const SessionsRouter = Router();

const UM = new UserManager();

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

SessionsRouter.get("/login", async (req, res) => {
  let { user, pass } = req.query;

  const userLogged = await UM.login(user, pass);
  res.send({ status: "ok", message: userLogged });
});

export default SessionsRouter;
