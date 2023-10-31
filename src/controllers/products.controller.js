import { productService } from "../services/factory.js";
import { generateProducts } from "../utils.js";
import EErrors from "../services/errors/errors-enum.js";
import CustomError from "../services/errors/CustomError.js";
import { generateProductsErrorInfo } from "../services/errors/messages/products-creation-error.js";

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

    if (!producto.title || producto.price || producto.stock) {
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
      message: error,
      message,
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
