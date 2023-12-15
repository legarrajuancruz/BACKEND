import mongoose from "mongoose";

const collectionName = "Carts";

const cartsSchema = new mongoose.Schema({
  usuario: String,
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
      quantity: { type: Number, default: 1 },
    },
  ],
});

cartsSchema.pre("findOne", function () {
  this.populate("products.product");
});

export const CartsModel = mongoose.model(collectionName, cartsSchema);
