import ProductsModel from "../models/products.model.js";

export default class ProductService {
  constructor() {
    console.log("Products with Database persistence in mongodb");
  }

  getAll = async () => {
    let products = await ProductsModel.find();
    return products.map((eL) => eL.toObject());
  };

  getProductbyId = async (id) => {
    return await ProductsModel.findById(id);
  };

  save = async (product) => {
    let result = await ProductsModel.create(product);
    return result;
  };
  deleteOne = async (id) => {
    let result = await ProductsModel.deleteOne(id);
  };
  updateProduct = async (id, productUpdated) => {
    let result = await ProductsModel.updateOne({ _id: id }, productUpdated);
  };
}
