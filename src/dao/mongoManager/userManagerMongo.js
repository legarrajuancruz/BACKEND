import userModel from "../models/user.model.js";

export default class UserService {
  constructor() {
    console.log("Users with Database persistence in mongodb");
  }

  crearUsuario = async (usuarioNuevo) => {
    console.log(usuarioNuevo.email);
    if (
      usuarioNuevo.email === "adminCoder@coder.com" &&
      usuarioNuevo.password === "adminCod3r123"
    ) {
      usuarioNuevo.role = "admin";
      let result = await userModel.create(usuarioNuevo);
      return result;
    }
    let result = await userModel.create(usuarioNuevo);
    console.log(usuarioNuevo);

    return result;
  };

  login = async (user, pass) => {
    try {
      const userLogged = await userModel.findOne({
        $and: [{ email: user }, { password: pass }],
      });

      if (userLogged) {
        console.log("User Logged");
        return userLogged;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  leerUsuarios = async ({ email }) => {
    console.log({ email });
    let users = await userModel.findOne({ email });

    return users;
  };
}
