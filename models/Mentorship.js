import mongoose from "mongoose";

const mentorshipSchema = new mongoose.Schema({
  mentee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'declined'], 
    default: 'pending' 
  },
}, { timestamps: true });

export default mongoose.model("Mentorship", mentorshipSchema);