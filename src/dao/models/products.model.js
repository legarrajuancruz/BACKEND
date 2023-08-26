import mongoose from "mongoose";

const productCollection = "products";
const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  stock: {
    type: String,
    required: false,
  },
  category: {
    type: String,
    required: false,
  },
  img: {
    type: String,
    required: false,
  },
});

const productsModel = mongoose.model(productCollection, productSchema);
export default productsModel;
