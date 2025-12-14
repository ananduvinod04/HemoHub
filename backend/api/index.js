const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// DB
const connectDB = require("../src/config/db");

// Routes
const testRoutes = require("../src/routes/testRoute");
const donorRoutes = require("../src/routes/donorRoutes");
const recipientRoutes = require("../src/routes/recipientRoutes");
const hospitalRoutes = require("../src/routes/hospitalRoutes");
const adminRoutes = require("../src/routes/adminRoutes");

dotenv.config();

const app = express();

//Connect MongoDB
connectDB();

// Middlewares
app.use(express.json());
app.use(cookieParser());

// CORS (important for frontend + cookies)
app.use(
  cors({
    origin:  process.env.FRONTEND_URL, // change this
    credentials: true,
  })
);

// Routes
app.use("/api", testRoutes);
app.use("/api/donor", donorRoutes);
app.use("/api/recipient", recipientRoutes);
app.use("/api/hospital", hospitalRoutes);
app.use("/api/admin", adminRoutes);


module.exports = app; // REQUIRED for Vercel
