// index.js
import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

// Import all our models
import User from "./models/User.js";
import Student from "./models/Student.js";
import Alumni from "./models/Alumni.js";
import Admin from "./models/Admin.js";
import Event from "./models/Event.js";
import Mentorship from "./models/Mentorship.js";
import Notification from "./models/Notification.js";

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 3000;

// Connect to Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ DB connection error:", err));

// Middleware
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

// View engine
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// --- PUBLIC ROUTES ---
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/login", (req, res) => {
  res.render("login", { error: null });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const errorMessage = "Wrong credentials. Please try again.";

  try {
    const user = await User.findOne({ email });
    if (!user) return res.render("login", { error: errorMessage });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.render("login", { error: errorMessage });

    if (user.role === "student") return res.redirect(`/student/dashboard/${user._id}`);
    if (user.role === "alumni") return res.redirect(`/alumni/dashboard/${user._id}`);
    if (user.role === "admin") return res.redirect(`/admin/dashboard/${user._id}`);

    return res.render("login", { error: "No dashboard assigned for this role" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Server error: " + err.message);
  }
});


// --- STUDENT ROUTES ---
app.get("/student/dashboard/:id", async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        const events = await Event.find({}).sort({ date: 1 }); 
        const mentors = await Alumni.find({ isMentor: true });

        const requestsSent = await Mentorship.find({ mentee: student._id });
        const pendingMentorIds = requestsSent.map(req => req.mentor.toString());

        if (!student) return res.status(404).send("Student not found");

        res.render("student_dashboard", { 
            user: student, 
            events, 
            mentors,
            pendingMentorIds 
        });
    } catch (err) {
        res.status(500).send("Server error: " + err.message);
    }
});

// --- ALUMNI ROUTES ---
app.get("/alumni/dashboard/:id", async (req, res) => {
    try {
        const alumni = await Alumni.findById(req.params.id);
        const events = await Event.find({}).sort({ date: 1 });
        const students = await Student.find({}); 

        const mentorshipRequests = await Mentorship.find({ mentor: alumni._id, status: 'pending' }).populate('mentee');
        const notifications = await Notification.find({ recipientRole: 'alumni', isRead: false }).sort({ createdAt: -1 });

        if (!alumni) return res.status(404).send("Alumni not found");

        res.render("alumni_dashboard", { 
            user: alumni, 
            events, 
            students,
            requests: mentorshipRequests,
            notifications: notifications 
        });
    } catch (err) {
        res.status(500).send("Server error: " + err.message);
    }
});


// --- ADMIN ROUTES ---
app.get("/admin/dashboard/:id", async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);
        const studentCount = await Student.countDocuments();
        const alumniCount = await Alumni.countDocuments();
        const allUsers = await User.find({ role: { $ne: 'admin' } }); 
        const events = await Event.find({}).sort({ date: 1 });

        if (!admin) return res.status(404).send("Admin not found");

        res.render("admin_dashboard", {
            user: admin,
            stats: {
                students: studentCount,
                alumni: alumniCount,
                total: studentCount + alumniCount,
                events: events.length
            },
            users: allUsers,
            events: events,
        });
    } catch (err) {
        res.status(500).send("Server error: " + err.message);
    }
});

app.post('/admin/events/create/:adminId', async (req, res) => {
    try {
        const { eventName, eventHost, eventVenue, eventDate } = req.body;
        await Event.create({
            name: eventName,
            hostedBy: eventHost,
            venue: eventVenue,
            date: eventDate
        });
        res.redirect(`/admin/dashboard/${req.params.adminId}`);
    } catch (err) {
        res.status(500).send("Error creating event: " + err.message);
    }
});

app.post('/admin/events/delete/:eventId/:adminId', async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.eventId);
        res.redirect(`/admin/dashboard/${req.params.adminId}`);
    } catch (err) {
        res.status(500).send("Error deleting event: " + err.message);
    }
});

app.post('/admin/users/delete/:userId/:adminId', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.redirect(`/admin/dashboard/${req.params.adminId}`);
    } catch(err) {
        res.status(500).send("Error deleting user: " + err.message);
    }
});


// --- MENTORSHIP AND NOTIFICATION ROUTES ---
app.post('/student/mentor-request/:mentorId/:studentId', async (req, res) => {
    try {
        await Mentorship.create({
            mentee: req.params.studentId,
            mentor: req.params.mentorId,
            status: 'pending'
        });
        res.redirect(`/student/dashboard/${req.params.studentId}`);
    } catch(err) {
        res.status(500).send("Error sending request: " + err.message);
    }
});

app.post('/alumni/request-accept/:requestId/:alumniId', async (req, res) => {
    try {
        await Mentorship.findByIdAndUpdate(req.params.requestId, { status: 'accepted' });
        res.redirect(`/alumni/dashboard/${req.params.alumniId}`);
    } catch(err) {
        res.status(500).send("Error accepting request: " + err.message);
    }
});

app.post('/student/register-event/:eventId/:studentId', async (req, res) => {
    try {
        const student = await Student.findById(req.params.studentId);
        const event = await Event.findById(req.params.eventId);

        await Notification.create({
            message: `${student.username} has registered for the event: "${event.name}".`,
            recipientRole: 'alumni'
        });
        
        res.redirect(`/student/dashboard/${req.params.studentId}`);
    } catch(err) {
        res.status(500).send("Error registering for event: " + err.message);
    }
});



app.listen(port, () => {
  console.log(`🚀 Listening on http://localhost:${port}`);
});