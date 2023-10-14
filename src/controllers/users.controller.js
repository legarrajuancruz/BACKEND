import userModel from "../services/dao/models/user.model.js";

//LEER
const getUsers = async (req, res) => {
  try {
    let usuarios = await userModel.find();
    console.log(usuarios);
    res.status(202).send({
      result: "Usuarios obtenidos con exito",
      payload: usuarios,
    });
  } catch (error) {
    console.error("No se pudo obtener los usuarios con mongoose:" + error);
    res.status(500).send({
      error: "No se encontraron los usuarios con mongoose",
      message: error,
    });
  }
};

//LEER ID
const getUsersById = async (req, res) => {
  try {
    let _id = req.params.id;
    console.log(_id);

    let carritoId = await userModel.findById({ _id });

    res.status(202).send({
      result: "Carrito obtenido con exito",
      carrito: carritoId,
    });
  } catch (error) {
    console.error("No se pudo obtener carrito con mongoose:" + error);
    res.status(500).send({
      error: "No se pudo obtener el carrito con mongoose",
      message: error,
    });
  }
};

//CREAR
const addUser = async (req, res) => {
  try {
    let carritoNuevo = await userModel.addCarts();
    res.status(201).send(carritoNuevo);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: error, message: "No se pudo guardar el Carrito." });
  }
};

//ELIMINAR POR ID
const deleteUserById = async (req, res) => {
  try {
    let _id = req.params.id;
    console.log(_id);

    let eliminado = await userModel.getCartsById({ _id });
    await cart.deleteCart({ _id });

    res.status(202).send({
      result: "Carrito eliminado con exito",
      producto: eliminado,
    });
  } catch (error) {
    console.error("No se pudo obtener carrito con mongoose:" + error);
    res.status(500).send({
      error: "No se pudo eliminar el carrito con mongoose",
      message: error,
    });
  }
};

//AGREGAR AL CARRITO
const addProductsToCart = async (req, res) => {
  try {
    let cid = req.params.cid;
    const { quantity } = req.body;

    const pid = req.params.pid;

    let producto = await userService.getProductbyId(pid);

    let modificado = await userService.addProductToCart(cid.toString(), {
      _id: pid,
      quantity: quantity,
    });

    res.status(202).send({
      result: "Carrito modificado con exito",
      Carritos: modificado,
    });
  } catch (error) {
    console.error("No se pudo actualizar carrito con mongoose:" + error);
    res.status(500).send({
      error: "No se pudo actualizar el carrito con mongoose",
      message: error,
    });
  }
};

export default {
  getUsers,
  getUsersById,
  addUser,
  deleteUserById,
  addProductsToCart,
};
