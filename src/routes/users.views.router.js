import { Router } from "express";
import passport from "passport";
import { userService } from "../services/factory.js";
// import UserService from "../services/dao/mongoManager/userManagerMongo.js";
// const US = new UserService();
const userRouter = Router();

//VISTA LOGIN
userRouter.get("/login", (req, res) => {
  res.render("login");
});

//VISTA REGISTRO
userRouter.get("/register", (req, res) => {
  res.render("register");
});

//VISTA RECUPERAR USUARIO
userRouter.get("/recuperar", (req, res) => {
  res.render("recuperar");
});

//VISTA PASSWORD TOKEN
userRouter.get("/newPassword/:token", async (req, res) => {
  const { token } = req.params;
  console.log(token);

  const resetPasswordToken = token;
  const password = await userService.getEmailToken({ resetPasswordToken });

  if (password != "mellon" || password === null) {
    return res.redirect("/users/recuperar");
  } else {
    res.render("newPassword", { token });
  }
});

//VISTA SUBIR ARCHIVOS PREMIUM
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

//VISTA SER PREMIUM
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
//VISTA PROFILE SESSION
userRouter.get("/profile", (req, res) => {
  res.render("profile", {
    user: req.session.user,
  });
});

//VISTA PROFILE JWT COOKIE
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
