import { Router } from "express";
import passport from "passport";
import { generateJWToken } from "../utils.js";

const sessionsRouter = Router();

sessionsRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

//Githubcallback
sessionsRouter.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/github/error" }),
  async (req, res) => {
    const user = req.user;

    req.session.user = {
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      age: user.age,
    };
    req.session.user.role = "user";
    res.redirect("/users/profile");
  }
);

sessionsRouter.post("/login", async (req, res) => {
  passport.authenticate("login", async (err, user) => {
    if (err) {
      return res.status(500).send({ error: "Error interno del servidor" });
    }

    if (!user) {
      return res.status(401).send({
        status: "error",
        message: "Credenciales incorrectas",
      });
    }
    const access_token = generateJWToken(user);
    res.status(201).send({
      status: "success",
      message: "Usuario logueado con éxito",
      access_token: access_token,
    });
  })(req, res);
});

sessionsRouter.post("/register", async (req, res) => {
  passport.authenticate("register", async (err, user) => {
    if (err) {
      return res.status(500).send({ error: "Error interno del servidor" });
    }
    if (!user) {
      return res.status(400).send({
        status: "error",
        message: "Usuario ya registrado",
      });
    }
    res
      .status(201)
      .send({ status: "success", message: "Usuario creado con exito" });
  })(req, res);
});

sessionsRouter.post("/logout", async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/");
    }
    return res.redirect("/users/login");
  });
});

sessionsRouter.get("/fail-register", (req, res) => {
  res.status(401).send({ error: "Error al procesar el registro" });
});

sessionsRouter.get("/fail-login", (req, res) => {
  res.status(401).send({ error: "Error al procesar el login" });
});

sessionsRouter.post("/newPassword/:token", async (req, res) => {
  authController.newPassword(req, res);
});

export default sessionsRouter;
