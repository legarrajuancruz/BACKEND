import userModel from "../models/user.model.js";

export default class UserService {
  constructor() {
    console.log("Users with Database persistence in mongodb");
  }
  getUsers = async () => {
    let users = await userModel.find();
    return users;
  };

  getUserByID = async (id) => {
    let usuarioEncontrado = await userModel.findById(id);
    return usuarioEncontrado;
  };

  crearUsuario = async (usuarioNuevo) => {
    console.log(usuarioNuevo.email);
    if (usuarioNuevo.email === "adminCoder@coder.com") {
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
  updateUser = async (filter, value) => {
    let result = await userModel.updateOne(filter, value);
    return result;
  };

  /*==========================
  -   ADD Products to Cart   -
  ==========================*/

  addProductToCart = async (uid, obj) => {
    try {
      const { _id, quantity } = obj;
      const filter = { _id: uid, "products._id": _id };
      const userCart = await userModel.findById(uid);
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
      return await userModel.findById(uid);
    } catch (error) {
      console.error(`Error al agregar  el producto al carrito`, error.nessage);
    }
  };
  /*==========================
  -      VACIAR CARRITO      -
  ==========================*/
  vaciarCarrito = async (_id) => {
    try {
      console.log("VACIANDO CARRITO");
      console.log(_id);
      const user = await userModel.updateOne({ _id: _id, products: [] });

      console.log(user.products);

      return user;
    } catch (error) {
      console.error("No se pudo vaciar el carrito", error);
    }
  };
}
