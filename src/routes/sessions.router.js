import { Router } from "express";
import passport from "passport";
import sessions from "../controllers/sessions.controller.js";

const sessionsRouter = Router();

sessionsRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  sessions.users
);

//Githubcallback
sessionsRouter.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/github/error" }),
  sessions.github
);

sessionsRouter.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/api/sessions/fail-login",
  }),
  sessions.login
);

sessionsRouter.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/api/sessions/fail-register",
  }),
  sessions.failRegister
);

sessionsRouter.post("/logout", sessions.logout);

sessionsRouter.get("/fail-register", sessions.failRegister);

sessionsRouter.get("/fail-login", sessions.failLogin);

export default sessionsRouter;
