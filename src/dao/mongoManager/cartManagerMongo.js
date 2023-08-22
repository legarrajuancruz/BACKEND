import CartsModel from "../models/carts.model.js";

export default class CartService {
  constructor() {
    console.log("Products with Database persistence in mongodb");
  }

  getAll = async () => {
    let carts = await CartsModel.find();
    return carts.map((eL) => eL.toObject());
  };

  getProductbyId = async (id) => {
    return await CartsModel.findById(id);
  };

  save = async (product) => {
    let result = await CartsModel.create(product);
    return result;
  };
  deleteOne = async (id) => {
    let result = await CartsModel.deleteOne(id);
  };
  updateProduct = async (id, cartUpdated) => {
    let result = await CartsModel.updateOne({ _id: id }, cartUpdated);
  };
}
