import mongoose from "mongoose";

const collectionName = "Carts";

const cartsSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
    required: true,
    products: [],
  },
});

const CartsModel = mongoose.model(collectionName, cartsSchema);
export default CartsModel;
