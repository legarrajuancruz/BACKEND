import { Router } from "express";
import userModel from "../dao/models/user.model.js";
import { isValidPassword } from "../utils.js";
import { generateJWToken } from "../utils.js";

const JWTrouter = Router();

JWTrouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    console.log("Usuario encontrado para login");
    console.log(user);
    if (!user) {
      console.warn("Usuario no existe en la base de datos" + email);
      return res.status(204).send({
        error: "No econtrado",
        message: "Usuario no encontrado" + email,
      });
    }
    if (!isValidPassword(user, password)) {
      console.warn("Credenciales incorrectas" + email);
      return res.status(401).send({
        status: "error",
        error: "El usuario o la contraseña no coinciden",
      });
    }
    const tokenUser = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      age: user.age,
      role: user.role,
    };
    const access_Token = generateJWToken(tokenUser);
    console.log(access_Token);

    //localstorage
    res.send({ message: "Login successs", jwt: access_Token });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: "error", error: "error interno de la aplicacion" });
  }
});

export default JWTrouter;
