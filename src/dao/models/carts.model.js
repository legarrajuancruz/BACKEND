import mongoose from "mongoose";

const collectionName = "Carts";

const cartsSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
    required: true,
  },
  products: {
    type: {
      product: {
        type: Array,
      },
      _id: {
        type: mongoose.Types.ObjectId,
        ref: "Products",
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
    default: [],
  },
});

// cartsSchema.pre("findOne", function () {
//   this.populate("products.product");
// });

const CartsModel = mongoose.model(collectionName, cartsSchema);
export default CartsModel;
