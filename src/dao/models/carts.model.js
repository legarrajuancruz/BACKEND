import mongoose from "mongoose";

const collectionName = "Carts";

const cartsSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  products: [
    {
      product: {},
      quantity: { Number },
    },
  ],
});

export const CartsModel = mongoose.model(collectionName, cartsSchema);
