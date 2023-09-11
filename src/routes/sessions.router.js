import { Router } from "express";
import UserManager from "../dao/mongoManager/userManagerMongo.js";

const sessionsRouter = Router();

const UM = new UserManager();

SessionsRouter.post("/login", async (req, res) => {
  let { user, pass } = req.body;
  console.log(user, pass);
  const userLogged = await UM.login(user, pass);
  console.log("USER LOGIN");
  console.log(userLogged);
  if (userLogged) {
    res.send({ status: "OK", message: userLogged });
  } else {
    res
      .status(401)
      .send({ status: "Error", message: "No se pudo loguaer el usuario" });
  }
  //DAMOS DE ALTA LA SESION
  req.session.user = {
    name: `${userLogged.first_name} ${userLogged.last_name}`,
    email: userLogged.email,
    age: userLogged.age,
  };

  res.send({
    status: "success",
    payload: req.session.user,
    message: "Primer logueo realizado",
  });
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
  res.send({
    status: "success",
    messgae: "Usuario creado con exito! con ID:" + result._id,
  });
});

export default sessionsRouter;
