import mongoose from "mongoose";
import User from "./User.js";

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  link: String,
  image: String,
});

const studentSchema = new mongoose.Schema({
  institute: { type: String, default: "Not specified" },
  currentYear: { type: Number },
  course: { type: String },
  profilePicture: { type: String, default: '/Assets/default-avatar.png' },
  projects: [projectSchema],
  skills: { type: [String], default: [] }
});


const Student = User.discriminator("student", studentSchema);

export default Student;