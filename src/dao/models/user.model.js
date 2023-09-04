import mongoose from "mongoose";

const collection = "users";

const userSchema = new mongoose.Schema({
  name: String,
  lastname: String,
  email: String,
  age: Number,
  password: String,
});

const userModel = mongoose.model(collection, userSchema);

export default userModel;
