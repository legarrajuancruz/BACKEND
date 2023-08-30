import { Router } from "express";
import ProductService from "../dao/mongoManager/productManagerMongo.js";
import { uploader } from "../utils.js";

const productRouter = Router();

const productService = new ProductService();

/*==============
| MongoManager |
==============*/

//CREAR
productRouter.post("/", uploader.single("file"), async (req, res) => {
  try {
    let producto = req.body;
    producto.img = req.file.path;

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
});

//LEER
productRouter.get("/", async (req, res) => {
  try {
    let products = await productService.leerProductos(res.query);

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
});

//LEER ID
productRouter.get("/:id", async (req, res) => {
  try {
    let _id = req.params.id;
    console.log(_id);

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
});

//ELIMINAR
productRouter.delete("/:id", async (req, res) => {
  try {
    console.log(req.params.id);

    let eliminado = await productService.getProductbyId(req.params.id);
    await productService.borrarProducto(req.params.id);

    res.status(202).send({
      result: "Producto eliminado con exito",
      producto: eliminado,
    });
  } catch (error) {
    console.error("No se pudo obtener producto con mongoose:" + error);
    res.status(500).send({
      error: "No se pudo eliminar el producto con mongoose",
      message: error,
    });
  }
});

//MODIFICAR
productRouter.put("/:id", uploader.single("file"), async (req, res) => {
  try {
    let productUpdated = req.body;
    productUpdated.img = req.file.path;

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
});
export default productRouter;
