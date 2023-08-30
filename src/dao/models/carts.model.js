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
          ref: "product",
        },
        quantity: { type: Number, default: 1 },
      },
    ],
    default: [],
  },
});

export const CartsModel = mongoose.model(collectionName, cartsSchema);
