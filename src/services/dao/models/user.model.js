import mongoose from "mongoose";

const collection = "users";

const userSchema = new mongoose.Schema({
  code: { type: mongoose.Schema.Types.ObjectId },
  first_name: String,
  last_name: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: Number,
  password: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
      quantity: { type: Number, default: 1 },
    },
  ],
  orders: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "tickets",
      },
    ],
  },

  loggedBy: String,
});
userSchema.pre("findOne", function () {
  this.populate("products.product");
});

const userModel = mongoose.model(collection, userSchema);

export default userModel;
