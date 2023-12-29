import mongoose from "mongoose";

const collection = "users";

const userSchema = new mongoose.Schema({
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
    enum: ["user", "admin", "premium"],
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Carts",
  },
  orders: [
    {
      ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "tickets",
      },
    },
  ],
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  loggedBy: String,
  last_connection: Date,
  documents: [
    {
      name: { type: String, unique: true },
      reference: String,
      status: { type: String, default: "Pending" },
    },
  ],
});

userSchema.pre("findOne", function () {
  this.populate("orders.ticket");
});

const userModel = mongoose.model(collection, userSchema);

export default userModel;
