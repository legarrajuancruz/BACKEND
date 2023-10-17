import { Router } from "express";
import passport from "passport";

const userRouter = Router();

userRouter.get("/login", (req, res) => {
  res.render("login");
});

userRouter.get("/register", (req, res) => {
  res.render("register");
});

userRouter.get("/profile", (req, res) => {
  console.log(req.session.user);
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

export default userRouter;
