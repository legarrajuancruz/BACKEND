import { Router } from "express";
import passport from "passport";

const userRouter = Router();

userRouter.get("/login", (req, res) => {
  res.render("login");
});

userRouter.get("/register", (req, res) => {
  res.render("register");
});

userRouter.get("/recuperar", (req, res) => {
  res.render("recuperar");
});

userRouter.get("/profile", (req, res) => {
  res.render("profile", {
    user: req.session.user,
  });
});

userRouter.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.render("profile", {
      user: req.user,
    });
  }
);

userRouter.get("/newPassword", (req, res) => {
  res.render("newPassword");
});

export default userRouter;
