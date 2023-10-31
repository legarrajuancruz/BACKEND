import { productService } from "../services/factory.js";
import { generateProducts } from "../utils.js";
import mongoose from "mongoose";
import EErrors from "../services/errors/errors-enum.js";
import CustomError from "../services/errors/CustomError.js";
import {
  generateProductsErrorInfo,
  eliminateProductsErrorInfo,
  getProductByIdErrorInfo,
} from "../services/errors/messages/products-creation-error.js";

//CREAR
const addProduct = async (req, res) => {
  try {
    const producto = {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
      category: req.body.category,
      img: req.body.img,
    };

    if (
      !producto.title ||
      producto.price != Number ||
      !producto.stock != Number
    ) {
      CustomError.createError({
        name: "Product creation error",
        cause: generateProductsErrorInfo(producto),
        message: "Error creando el producto",
        code: EErrors.INVALID_TYPES_ERROR,
      });
    }

    let proudctoCreado = await productService.crearProducto(producto);

    res.status(201).send({
      result: "Producto creado con exito",
      producto: proudctoCreado,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      error: error.code,
      message: error.message,
    });
  }
};

//LEER
const getProduct = async (req, res) => {
  try {
    let products = await productService.leerProductos(req.query);

    res.send({
      result: "Productos obtenido con exito",
      Productos: products,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: error, message: "No se pudo obtener el producto." });
  }
};

//LEER ID
const getProductById = async (req, res) => {
  try {
    let _id = req.params.id;

    if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
      CustomError.createError({
        name: "Product Get error",
        cause: getProductByIdErrorInfo(_id),
        message: "Error al obtener el producto",
        code: EErrors.NI_EL_PROGRAMADOR_SABE_QUE_PASO,
      });
    }

    let producto = await productService.getProductbyId({ _id });

    res.status(202).send({
      result: "Producto obtenido con exito",
      producto: producto,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      error: error.code,
      message: error.message,
    });
  }
};

//ELIMINAR
const deleteProduct = async (req, res) => {
  try {
    let _id = req.params.id;
    let products = await productService.leerProductos(req.query);

    if (!_id || _id != products._id) {
      CustomError.createError({
        name: "Product eliminate error",
        cause: eliminateProductsErrorInfo(_id),
        message: "Error al eliminar el producto",
        code: EErrors.INVALID_TYPES_ERROR,
      });
    }

    let eliminado = await productService.getProductbyId(_id);
    await productService.borrarProducto(req.params.id);

    res.status(202).send({
      result: "Producto eliminado con exito",
      payload: eliminado,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      error: error.code,
      message: error.message,
    });
  }
};

//MODIFICAR
const modProduct = async (req, res) => {
  try {
    let productUpdated = req.body;

    let productoActualizado = await productService.actualizarProducto(
      req.params.id,
      productUpdated
    );

    res.status(202).send({
      result: "Producto modificado con exito",
      payload: productoActualizado,
    });
  } catch (error) {
    console.error("No se pudo actualizar el producto con mongoose:" + error);
    res.status(500).send({
      error: "No se pudo actualizar el producto con mongoose",
      message: error,
    });
  }
};

const getProductMockup = async (req, res) => {
  try {
    let products = [];
    for (let i = 0; i < 100; i++) {
      products.push(generateProducts());
    }

    res.send({
      status: "success",
      result: "Productos Generados con exito",
      Productos: products,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: error, message: "No se pudo crear los productos." });
  }
};

export default {
  addProduct,
  getProduct,
  getProductById,
  deleteProduct,
  modProduct,
  getProductMockup,
};
