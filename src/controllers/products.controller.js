import { Router } from "express";
import ProductService from "../dao/mongoManager/productManagerMongo.js";

const productService = new ProductService();

//CREAR
const addProduct = async (req, res) => {
  try {
    let producto = req.body;
    console.log(producto);

    let proudctoCreado = await productService.crearProducto(producto);

    res.status(201).send({
      result: "Producto creado con exito",
      producto: proudctoCreado,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: error, message: "No se pudo guardar el producto." });
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

    let producto = await productService.getProductbyId({ _id });

    res.status(202).send({
      result: "Producto obtenido con exito",
      producto: producto,
    });
  } catch (error) {
    console.error("No se pudo obtener producto con mongoose:" + error);
    res.status(500).send({
      error: "No se pudo obtener el producto con mongoose",
      message: error,
    });
  }
};

//ELIMINAR
const deleteProduct = async (req, res) => {
  try {
    let _id = req.params.id;

    let eliminado = await productService.getProductbyId(_id);
    await productService.borrarProducto(req.params.id);

    res.status(202).send({
      result: "Producto eliminado con exito",
      payload: eliminado,
    });
  } catch (error) {
    console.error("No se pudo obtener producto con mongoose:" + error);
    res.status(500).send({
      error: "No se pudo eliminar el producto con mongoose",
      message: error,
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

export default {
  addProduct,
  getProduct,
  getProductById,
  deleteProduct,
  modProduct,
};
