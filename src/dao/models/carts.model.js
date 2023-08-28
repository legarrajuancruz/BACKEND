import mongoose from "mongoose";

const collectionName = "Carts";

const cartsSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  products: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
        },
        quantity: { Number },
      },
    ],
    default: [],
  },
});

export const CartsModel = mongoose.model(collectionName, cartsSchema);
