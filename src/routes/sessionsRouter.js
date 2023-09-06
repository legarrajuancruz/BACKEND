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

SessionsRouter.post("/login", async (req, res) => {
  const userLogged = await UM.login(req.body);

  console.log(userLogged);
  if (userLogged) {
    res.send({ status: "User login success", message: userLogged });
    console.log(userLogged);

    req.session.user = {
      name: `${userLogged.first_name}, ${userLogged.last_name}`,
      email: `userLogged.email`,
      age: `userLogged.edad`,
    };
  } else {
    res
      .status(401)
      .send({ status: "Error", message: "No se pude loguear el usuario" });
  }

  res.send({
    status: "success",
    payload: req.session.user,
    message: "Primer logueo realizado",
  });
});

export default SessionsRouter;
