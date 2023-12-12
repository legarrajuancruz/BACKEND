import { Router } from "express";
import passport from "passport";
import UserService from "../services/dao/mongoManager/userManagerMongo.js";

const US = new UserService();

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

userRouter.get("/newPassword/:token", async (req, res) => {
  const { token } = req.params;
  console.log(token);

  const resetPasswordToken = token;
  const password = await US.getEmailToken({ resetPasswordToken });

  if (password != "mellon" || password === null) {
    return res.redirect("/users/recuperar");
  } else {
    res.render("newPassword", { token });
  }
});

userRouter.get("/profile", (req, res) => {
  res.render("profile", {
    user: req.session.user,
  });
});

userRouter.get(
  "/uploads",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const user = req.user;
    if (user.role === "user" || user.role === "premium") {
      res.render("uploads", { user });
    } else {
      res.render("error");
    }
  }
);

userRouter.get(
  "/premium",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const user = req.user;
    if (user.role === "user") {
      res.render("premium", { user });
    } else {
      res.render("error");
    }
  }
);
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
