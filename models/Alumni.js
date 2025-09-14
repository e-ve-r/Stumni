import mongoose from "mongoose";
import User from "./User.js";

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  link: String,
  image: String,
});

const alumniSchema = new mongoose.Schema({
  almaMater: { type: String, default: "Not specified" },
  currentJob: {
    title: String,
    company: String,
  },
  skills: { type: [String], default: [] },
  projects: [projectSchema],
  isMentor: { type: Boolean, default: true },
  profilePicture: { type: String, default: '/Assets/default-avatar.png' }
});

const Alumni = User.discriminator("alumni", alumniSchema);

export default Alumni;