# 🎓 Student–Alumni Connect Platform  

A web-based platform that bridges the gap between **students and alumni**, enabling networking, mentorship, and event participation. The application provides separate dashboards for **students, alumni, and admins** with role-specific features.  

---

## 🚀 Features  

### 👩‍🎓 Student Dashboard  
- Showcase personal **projects**  
- Browse and send **friend/mentor requests** to alumni  
- View and register for **upcoming events**  

### 🎓 Alumni Dashboard  
- Display personal and professional **details**  
- Accept/decline **friend requests**  
- View and participate in **events**  

### 🛠️ Admin Dashboard  
- View **user statistics**  
- Manage **student & alumni accounts**  
- Create and manage **events**  

---

## 📦 Tech Stack  
- **Node.js** + **Express** – Backend framework  
- **MongoDB** + **Mongoose** – Database & ODM  
- **EJS** – Templating engine for rendering views  
- **bcrypt** – Password hashing for authentication  
- **body-parser** – Middleware for request parsing  

---

## ⚙️ Installation & Setup  

### 1️⃣ Clone the Repository  
```
git clone https://github.com/your-username/student-alumni-connect.git
cd student-alumni-connect
```
2️⃣ Install Dependencies
```
npm install express mongoose ejs bcrypt body-parser nodemon
```
3️⃣ Configure Environment Variables

Create a .env file in the root directory and add your MongoDB connection string:
```
MONGO_URI=your_mongodb_connection_string
PORT=5000
```
4️⃣ Seed Initial Data
Before running the app, seed the database with sample students, alumni, and admin:
```
nodemon seed.js
```
5️⃣ Run the Application
```
nodemon index.js
```
The server will run at:
👉 http://localhost:3000

📂 Project Structure
```
student-alumni-connect/
│── index.js          # Entry point of the app
│── seed.js           # Seed file for initial data
│── models/           # Mongoose schemas
│── routes/           # Express routes
│── views/            # EJS templates
│── public/           # Static files (CSS, JS, images)
│── .env              # Environment variables
│── package.json
│── README.md
```
