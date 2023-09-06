import userModel from "../models/user.model.js";

export default class UserService {
  constructor() {
    console.log("Users with Database persistence in mongodb");
  }

  crearUsuario = async (usuarioNuevo) => {
    let result = await userModel.create(usuarioNuevo);
    console.log(usuarioNuevo);

    return result;
  };

  login = async ({ email, pass }) => {
    const user = await userModel.findOne({ email }, { pass });
    console.log(user);

    return { user };
  };

  leerUsuarios = async ({ email }) => {
    console.log({ email });
    let users = await userModel.findOne({ email });

    return users;
  };

  getUsersId = async (id) => {
    return await userModel.findById(id);
  };
}
