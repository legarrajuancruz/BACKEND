import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productCollection = "product";
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
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    // required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    default: "admin",
  },
});

productSchema.pre("findOne", function () {
  this.populate({
    path: "owner",
    select: "_id role",
  });
});

productSchema.plugin(mongoosePaginate);

export const ProductsModel = mongoose.model(productCollection, productSchema);
