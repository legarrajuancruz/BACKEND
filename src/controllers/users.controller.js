import UserService from "../services/dao/mongoManager/userManagerMongo.js";
import CartService from "../services/dao/mongoManager/cartManagerMongo.js";
import ProductService from "../services/dao/mongoManager/productManagerMongo.js";

const US = new UserService();
const PS = new ProductService();
const CS = new CartService();

const leerUsuarios = async (req, res) => {
  try {
    let users = await US.getUsers(req.query);

    res.status(202).send({
      result: "Usuarios obtenidos con exito",
      Usuarios: users,
    });
  } catch (error) {
    console.error("No se pudo obtener usuarios con mongoose:" + error);
    res.status(500).send({
      error: "No se pudo obtener usuarios con mongoose",
      message: error,
    });
  }
};

const ControlgetUsersById = async (req, res) => {
  try {
    const _id = req.params.id;
    let user = await US.getUserByID(_id);

    res.status(202).send({
      result: "Usuario obtenido con exito",
      Usuario: user,
    });
  } catch (error) {
    console.error("No se pudo obtener el usuario con mongoose:" + error);
    res.status(500).send({
      error: "No se pudo obtener el usuario con mongoose",
      message: error,
    });
  }
};

/*==========================
  -   ADD Products to Cart   -
  ==========================*/
const agregaralCarritoUser = async (req, res) => {
  try {
    let uid = req.params.uid;
    const { quantity = 1 } = req.body;
    const pid = req.params.pid;

    let producto = await PS.getProductbyId(pid);

    let modificado = await US.addProductToCart(uid.toString(), {
      _id: pid,
      quantity: quantity,
    });

    res.status(202).send({
      result: "Carrito Usuario modificado con exito",
      usuario: modificado,
    });
  } catch (error) {
    console.error(
      "No se pudo actualizar carrito usuario con mongoose:" + error
    );
    res.status(500).send({
      error: "No se pudo actualizar el carrito usuario con mongoose",
      message: error,
    });
  }
};

const updateUser = async (filter, value) => {
  let result = await UserService.updateOne(filter, value);
  return result;
};

/*==========================
  -    ENVIAR EMAIL PASS   -
  ==========================*/
const resetPassword = async (req, res) => {
  try {
    let userEmail = req.body;

    await US.emailResetPassword(userEmail);

    res.status(202).send({ message: "email enviado con exito" });
  } catch (error) {
    console.error("No se pudo enviar el email con mongoose:" + error);
    res.status(500).send({
      error: "No se pudo enviar el correo, usuario no encontrado",
      message: error,
    });
  }
};

/*===========================
  -      NUEVA PASSWORD     -
  ==========================*/
const nuevaPassword = async (req, res) => {
  try {
    let { nueva, confirmar } = req.body;
    let { token } = req.params;
    let user = await US.findByToken(token);

    const update = {
      nueva,
      confirmar,
      token,
    };

    let modificado = await US.updatePassword(update);

    res.status(202).send({
      result: " Usuario modificado con exito",
      payload: modificado,
    });
  } catch (error) {}
};

export default {
  leerUsuarios,
  ControlgetUsersById,
  agregaralCarritoUser,
  updateUser,
  resetPassword,
  nuevaPassword,
};
