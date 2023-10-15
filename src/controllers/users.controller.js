import UserService from "../services/dao/mongoManager/userManagerMongo.js";

const US = new UserService();

const leerUsuarios = async (req, res) => {
  try {
    let users = await US.getUsers(req.query);

    res.status(202).send({
      result: "Carrito obtenido con exito",
      Carritos: users,
    });
  } catch (error) {
    console.error("No se pudo obtener carrito con mongoose:" + error);
    res.status(500).send({
      error: "No se pudo obtener el carrito con mongoose",
      message: error,
    });
  }
};

export default {
  leerUsuarios,
};
