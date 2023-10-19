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
  /*==========================
  -   ADD Products to Cart   -
  ==========================*/

  addProductToCart = async (uid, obj) => {
    try {
      console.log("USER ID");
      console.log(uid);
      const { _id, quantity } = obj;
      console.log("PRODUCT ID");
      console.log(obj);

      const filter = { _id: uid, "products._id": _id };
      console.log("FILTER");
      console.log(filter);

      const userCart = await userModel.findById(uid);
      console.log("USER CART ID");
      console.log(userCart);

      const findProduct = userCart.products.some(
        (product) => product._id.toString() === _id
      );
      console.log("Producto presente en carrito ?");
      console.log({ findProduct });

      if (findProduct) {
        const update = { $inc: { "products.$.quantity": quantity } };
        console.log("INC");
        console.log(update);
        await userModel.updateOne(filter, update);
      } else {
        console.log("PUSH");
        const update = {
          $push: { products: { _id: obj._id, quantity: quantity } },
        };
        console.log(update);
        await userModel.updateOne({ _id: uid }, update);
      }

      return await userModel.findById(uid);
    } catch (error) {
      console.error(`Error al agregar  el producto al carrito`, error.nessage);
    }
  };
}
