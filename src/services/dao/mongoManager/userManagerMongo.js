import userModel from "../models/user.model.js";

export default class UserService {
  constructor() {
    console.log("Users with Database persistence in mongodb");
  }
  getUsers = async () => {
    let users = await userModel.find();
    return users;
  };

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

  login = async (email) => {
    try {
      console.log(email);
      const userLogged = await userModel.findOne({ email });

      if (userLogged) {
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

  buscarID = async ({ _id }) => {
    console.log({ _id });
    let user = await userModel.findOne({ _id });

    return user;
  };

  /*===============================
  -   ADD Products to User Cart   -
  ===============================*/

  addProductToUserCart = async (uid, obj) => {
    try {
      console.log("INFO EN USER CART");
      console.log(uid);
      console.log({ obj });
      const { _id, quantity } = obj;

      const filter = { _id: uid, "product._id": _id };
      console.log("IMPRIMO EL FILTER");
      console.log(filter);

      const userCart = await userModel.findById(uid);
      console.log("IMPRIMO EL CART");
      console.log(userCart);

      const findProduct = userCart.products.some(
        (product) => product._id.toString() === _id
      );

      if (findProduct) {
        const update = { $inc: { "products.$.quantity": quantity } };
        await userModel.updateOne(filter, update);
      } else {
        const update = {
          $push: { products: { _id: obj._id, quantity: quantity } },
        };

        await userModel.updateOne({ _id: uid }, update);
      }
      userCart = await userModel.findById(uid);
      console.log(userCart);
      return userCart;
    } catch (error) {
      console.error(`Error al agregar  el producto al carrito`, error.nessage);
    }
  };
}
