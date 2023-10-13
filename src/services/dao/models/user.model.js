import mongoose from "mongoose";

const collection = "users";

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  full_name: {
    type: String,
    unique: true,
  },
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
  cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "Carts" }],
  loggedBy: String,
});
// userSchema.pre("findOne", function () {
//   this.populate("users.cart");
// });

const userModel = mongoose.model(collection, userSchema);

export default userModel;
