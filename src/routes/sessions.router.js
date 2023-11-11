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

sessionsRouter.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/api/sessions/fail-login",
  }),
  async (req, res) => {
    const user = req.user;
    console.log("Usuario encontrado para login:");
    console.log(user);

    if (!user)
      return res
        .status(401)
        .send({ status: "error", error: "credenciales incorrectas" });
    const access_token = generateJWToken(user);
    console.log(access_token);
    res.send({ access_token: access_token });
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
