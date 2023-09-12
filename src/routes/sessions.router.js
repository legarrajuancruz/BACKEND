import { Router } from "express";
import UserManager from "../dao/mongoManager/userManagerMongo.js";

import passport from "passport";

const sessionsRouter = Router();

const UM = new UserManager();

sessionsRouter.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/api/sessions/fail-login",
  }),
  async (req, res) => {
    console.log("Usuario no encontrado");
    const user = req.user;
    console.log(user);
    if (!user)
      return res.status(401).send({
        status: "error",
        error: "Credenciales incorrectas",
      });
    req.session.user = {
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      age: user.age,
    };
    res.send({
      status: "success",
      payload: req.session.user,
      message: "Primer logueo realizados",
    });
  }
);

sessionsRouter.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/api/sessions/fail-register",
  }),
  async (req, res) => {
    console.log("Nuevo usuario registrado");
    res
      .status(201)
      .send({ status: "success", message: "Usuario creado con exito" });
  }
);

sessionsRouter.post("/logout", async (request, response) => {
  request.session.destroy((err) => {
    if (err) {
      return response.redirect("/profile");
    }
    response.redirect("/users/login");
  });
});

sessionsRouter.get("/fail-register", (req, res) => {
  res.status(401).send({ error: "Error al procesar el registro" });
});

sessionsRouter.get("/fail-login", (req, res) => {
  res.status(401).send({ error: "Error al procesar el login" });
});

export default sessionsRouter;
