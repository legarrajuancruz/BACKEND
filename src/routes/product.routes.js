import { Router } from "express";
import ProductService from "../dao/mongoManager/productManagerMongo.js";
//import __dirname from "../utils.js";
import { uploader } from "../utils.js";
//import ProductManager from "../dao/fileManager/controllers/ProductManager.js";

const productRouter = Router();
//const product = new ProductManager()
const productService = new ProductService();

/*===========
| FileSystem |
============*/
//const product = new ProductManager();

/*============
-     GET    -
============*/
// ProductRouter.get(`/`, async (req, res) => {
//   res.send(await product.getProducts());
// });

/*============
  -   GET ID   -
  ============*/
// ProductRouter.get(`/:id`, async (req, res) => {
//   let id = parseInt(req.params.id);
//   res.send(await product.getProductsById(id));
// });

/*============
  -    POST    -
  ============*/
// ProductRouter.post("/", uploader.single("file"), async (req, res) => {
//   let newProduct = req.body;
//   newProduct.img = req.file.path;
//   res.send(await product.addProducts(newProduct));
// });

/*============
  - DELETE ID  -
  ============*/
// ProductRouter.delete("/:id", async (req, res) => {
//   let id = parseInt(req.params.id);
//   res.send(await product.deleteById(id));
// });

/*============
  -   PUT ID   -
  ============*/
// ProductRouter.put("/:id", async (req, res) => {
//   let id = parseInt(req.params.id);
//   let nuevo = req.body;
//   res.send(await product.updateProduct(id, nuevo));
// });

/*==============
| MongoManager |
==============*/

//LEER
productRouter.get("/", async (req, res) => {
  try {
    let products = await productService.getAll();
    res.send(products);
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

//CREAR
productRouter.post("/", uploader.single("file"), async (req, res) => {
  try {
    let producto = req.body;
    producto.img = req.file.path;
    await productService.save(producto);

    res.status(201).send(producto);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: error, message: "No se pudo guardar el producto." });
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

    let productoActualizado = await productService.updateProduct(
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
