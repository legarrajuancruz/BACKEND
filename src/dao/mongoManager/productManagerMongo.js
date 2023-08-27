import { ProductsModel } from "../models/products.model.js";

export default class ProductService {
  constructor() {
    console.log("Products with Database persistence in mongodb");
  }

  leerProductos = async () => {
    let products = await ProductsModel.find();
    return products;
  };

  getProductbyId = async (id) => {
    return await ProductsModel.findById(id);
  };

  crearProducto = async (product) => {
    let result = await ProductsModel.create(product);
    return result;
  };

  borrarProducto = async ({ id }) => {
    let productoBorrado = await ProductsModel.deleteOne({ id });
    return productoBorrado;
  };

  actualizarProducto = async (id, productUpdated) => {
    let productoActualizado = await ProductsModel.updateOne(
      { _id: id },
      productUpdated
    );
    return productoActualizado;
  };
}
