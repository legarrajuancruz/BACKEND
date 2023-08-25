import mongoose from "mongoose";

const collectionName = "Carts";

const cartsSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: String,
  productos: [
    {
      producto: { type: mongoose.Schema.Types.ObjectId, ref: "Producto" },
      cantidad: Number,
    },
  ],
});

// cartsSchema.pre("findOne", function () {
//   this.populate("products.product");
// });

const CartsModel = mongoose.model(collectionName, cartsSchema);
export default CartsModel;
