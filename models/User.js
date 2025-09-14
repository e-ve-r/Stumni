import mongoose from "mongoose";

const baseOptions = {
  discriminatorKey: 'role',
  collection: 'users',
};


const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, baseOptions);


export default mongoose.model("User", userSchema);