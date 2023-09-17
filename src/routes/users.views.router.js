import { Router } from "express";
import passport from "passport";
import { authToken } from "../utils.js";

const userRouter = Router();

userRouter.get("/login", (req, res) => {
  res.render("login");
});

userRouter.get("/register", (req, res) => {
  res.render("register");
});

userRouter.get("/", (req, res) => {
  res.render("profile", {
    user: req.user,
  });
});

export default userRouter;
