import { Router } from "express";

const userRouter = Router();

userRouter.get("/login", (req, res) => {
  res.render("login");
});

userRouter.get("/register", (req, res) => {
  res.render("register");
});

userRouter.get("/", (req, res) => {
  res.render("profile", {
    user: req.session.user,
  });
});

export default userRouter;
