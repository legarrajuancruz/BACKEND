import userModel from "../models/user.model.js";

export default class UserService {
  constructor() {
    console.log("Users with Database persistence in mongodb");
  }

  crearUsuario = async (usuarioNuevo) => {
    let result = await userModel.create(usuarioNuevo);
    console.log("UNuevo Usuario Registrado");
    console.log(result);
    return result;
  };

  login = async (user, pass) => {
    try {
      const userLogged =
        (await userModel.findOne({
          $and: [{ email: user }, { password: pass }],
        })) || null;
      console.log(userLogged);

      if (userLogged) {
        console.log("User logged");
        return user;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  leerUsuarios = async (params) => {
    let { limit, page, query, sort } = params;

    limit = limit ? limit : 10;
    page = page ? page : 1;
    query = query || {};
    sort = sort ? (sort == "asc" ? 1 : -1) : 0;
    let users = await userModel.find().lean();

    return users;
  };

  getUsersId = async (id) => {
    return await userModel.findById(id);
  };
}