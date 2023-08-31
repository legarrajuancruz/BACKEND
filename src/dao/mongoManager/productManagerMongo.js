import { ProductsModel } from "../models/products.model.js";

export default class ProductService {
  constructor() {
    console.log("Products with Database persistence in mongodb");
  }

  crearProducto = async (productoNuevo) => {
    let result = await ProductsModel.create(productoNuevo);
    return result;
  };

  leerProductos = async (params) => {
    let products = await ProductsModel.find();
    return products;
  };

  getProductbyId = async (id) => {
    return await ProductsModel.findById(id);
  };

  borrarProducto = async (id) => {
    let productoBorrado = await ProductsModel.deleteOne({ _id: id });
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
