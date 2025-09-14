import mongoose from "mongoose";
import User from "./User.js";

const adminSchema = new mongoose.Schema({});

const Admin = User.discriminator("admin", adminSchema);

export default Admin;