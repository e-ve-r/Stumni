import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    hostedBy: { type: String, required: true },
    venue: { type: String, required: true },
    date: { type: Date, required: true },
});

export default mongoose.model("Event", eventSchema);