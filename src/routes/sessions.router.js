import { Router } from "express";
import UserManager from "../dao/mongoManager/userManagerMongo.js";
import { createHash, isValidPassword } from "../utils.js";

const sessionsRouter = Router();

const UM = new UserManager();

sessionsRouter.post("/login", async (req, res) => {
  let { user, pass } = req.body;
  console.log(user, pass);
  const userLogged = await UM.login(user);
  console.log(userLogged);

  if (!isValidPassword(userLogged, pass)) {
    return res
      .status(401)
      .send({ status: "error", error: "Credenciales incorrectas" });
  }
  if (userLogged) {
    req.session.user = {
      name: userLogged.first_name,
      last_name: userLogged.last_name,
      email: userLogged.email,
      password: userLogged.password,
      age: userLogged.age,
      role: userLogged.role,
    };
    res.send({
      status: "OK",
      message: "Logueo Exitoso",
      payload: req.session.user,
    });
  } else {
    res
      .status(401)
      .send({ status: "Error", message: "No se pudo loguaer el usuario" });
  }
  //DAMOS DE ALTA LA SESION
});

sessionsRouter.post("/register", async (req, res) => {
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
    password: createHash(password),
  };

  const result = await UM.crearUsuario(user);
  console.log(result);
  res.send({
    status: "success",
    messgae: "Usuario creado con exito! con ID:" + result._id,
  });
});

sessionsRouter.post("/logout", async (request, response) => {
  request.session.destroy((err) => {
    if (err) {
      return response.redirect("/profile");
    }
    response.redirect("/users/login");
  });
});

export default sessionsRouter;
