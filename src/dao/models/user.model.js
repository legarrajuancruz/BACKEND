import mongoose from "mongoose";

const collection = "users";

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: {
    type: String,
    required: true,
  },
  age: Number,
  password: String,
});

const userModel = mongoose.model(collection, userSchema);

export default userModel;
