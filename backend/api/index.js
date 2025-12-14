const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("../src/config/db");

const donorRoutes = require("../src/routes/donorRoutes");
const hospitalRoutes = require("../src/routes/hospitalRoutes");
const recipientRoutes = require("../src/routes/recipientRoutes");
const adminRoutes = require("../src/routes/adminRoutes");

const errorHandler = require("../src/middlewares/errorMiddleware");

dotenv.config();

const app = express();

// Connect DB (serverless-safe)
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL, // 🔥 Vercel frontend
    credentials: true,
  })
);

// Routes
app.get("/", (req, res) => {
  res.send("🚀 HemoHub Backend is Running!");
});

app.use("/api/donor", donorRoutes);
app.use("/api/hospital", hospitalRoutes);
app.use("/api/recipient", recipientRoutes);
app.use("/api/admin", adminRoutes);

// Error handler
app.use(errorHandler);

// ❌ NO app.listen()
module.exports = app;
