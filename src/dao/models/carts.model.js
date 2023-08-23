import mongoose from "mongoose";

const collectionName = "Carts";

const cartsSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
    required: true,
  },
  products: {
    type: Array,
    default: [],
  },
});

cartsSchema.pre("findOne", function () {
  this.populate("products.product");
});

const CartsModel = mongoose.model(collectionName, cartsSchema);
export default CartsModel;
