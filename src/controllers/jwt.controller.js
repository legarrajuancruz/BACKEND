import userModel from "../services/dao/models/user.model.js";
import { isValidPassword } from "../utils.js";
import { generateJWToken } from "../utils.js";

const JWT = async (req, res) => {
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
    user.last_connection = Date.now();
    await user.save();

    const tokenUser = {
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      age: user.age,
      role: user.role,
      cart: user.cart,
      last_connection: user.last_connection,
    };
    const access_Token = generateJWToken(tokenUser);
    console.log("TOKEN JWT");
    console.log(access_Token);

    //cookie
    res.cookie("jwtCookieToken", access_Token, {
      maxAge: 3600000,
      httpOnly: true,
    });

    res.send({ message: "Login success" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: "error", error: "error interno de la aplicacion" });
  }
};

export default JWT;
