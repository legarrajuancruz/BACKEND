import { Router } from "express";

const loginRouter = Router();

loginRouter.get("/login", (req, res) => {
  res.render("github-login");
});

loginRouter.get("/error", (req, res) => {
  res.render("error", { error: "No se pudo auntenticar usando Github" });
});

export default loginRouter;
