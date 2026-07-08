const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();


const connectDB = require("./config/db");
const certificateRoutes = require("./routes/certificateRoutes");
const verifyRoutes = require("./routes/verifyRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Connect database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Static folder for uploaded/generated files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/certificates", certificateRoutes);
app.use("/api/verify", verifyRoutes);
app.use("/api/auth", authRoutes);


// Test route
app.get("/", (req, res) => {
  res.send("Digital Certificate Verification API is running");
});

// Server port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});