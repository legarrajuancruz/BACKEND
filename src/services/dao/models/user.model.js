import mongoose from "mongoose";

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
  cart: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Carts",
    },
  ],
  loggedBy: String,
});

userSchema.pre("findOne", function () {
  this.populate("cart.Carts");
});

const userModel = mongoose.model("users", userSchema);

export default userModel;
