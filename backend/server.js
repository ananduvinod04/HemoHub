const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./src/config/db');
const donorRoutes = require('./src/routes/donorRoutes');
const hospitalRoutes = require('./src/routes/hospitalRoutes');
const recipientRoutes = require('./src/routes/recipientRoutes');
const adminRoutes = require('./src/routes/adminRoutes');


const errorHandler = require('./src/middlewares/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect Database
connectDB();

const app = express();
app.set("trust proxy", 1);
// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL, // must match deployed frontend domain exactly
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Routes
app.get("/", (req, res) => {
  res.send("🚀 Express Server is Running Successfully!");
});

app.use('/api/donor', donorRoutes);
app.use('/api/hospital', hospitalRoutes);
app.use('/api/recipient', recipientRoutes);
app.use('/api/admin', adminRoutes);

  


// Error handler
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
