import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    message: { type: String, required: true },
    recipientRole: { type: String, enum: ['student', 'alumni', 'admin'], required: true },
    isRead: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("Notification", notificationSchema);