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
      Carritos: users,
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
    let user = await US.buscarID({ _id });

    res.status(202).send({
      result: "Usuario obtenido con exito",
      Carritos: user,
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
    const { quantity } = req.body;

    const pid = req.params.pid;

    let producto = await PS.getProductbyId(pid);
    console.log(producto);

    let modificado = await CS.addProductToCart(uid.toString(), {
      _id: pid,
      quantity: quantity,
    });

    res.status(202).send({
      result: "Carrito Usuario modificado con exito",
      Carritos: modificado,
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

export default {
  leerUsuarios,
  ControlgetUsersById,
  agregaralCarritoUser,
};
