const jwt = require("jsonwebtoken");
const Donor = require("../models/donorModel");
const Hospital = require("../models/hospitalModel");
const Admin = require("../models/adminModel");
const Recipient = require("../models/recipientModel");

// 🔥 Helper: extract token (HEADER FIRST → MOBILE SAFE)
const getToken = (req) => {
  if (req.headers.authorization?.startsWith("Bearer ")) {
    return req.headers.authorization.split(" ")[1];
  }

  if (req.cookies?.token) {
    return req.cookies.token;
  }

  return null;
};

// 🔥 Generic verify helper
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// ---------------- DONOR ----------------
const protect = async (req, res, next) => {
  const token = getToken(req);

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = verifyToken(token);

    const donor = await Donor.findById(decoded.id).select("-password");
    if (!donor) {
      return res.status(401).json({ message: "Donor not found" });
    }

    req.donor = donor;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

// ---------------- HOSPITAL ----------------
const protectHospital = async (req, res, next) => {
  const token = getToken(req);

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = verifyToken(token);

    const hospital = await Hospital.findById(decoded.id).select("-password");
    if (!hospital) {
      return res.status(401).json({ message: "Hospital not found" });
    }

    req.hospital = hospital;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

// ---------------- RECIPIENT ----------------
const protectRecipient = async (req, res, next) => {
  const token = getToken(req);

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = verifyToken(token);

    const recipient = await Recipient.findById(decoded.id).select("-password");
    if (!recipient) {
      return res.status(401).json({ message: "Recipient not found" });
    }

    req.recipient = recipient;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

// ---------------- ADMIN ----------------
const protectAdmin = async (req, res, next) => {
  const token = getToken(req);

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = verifyToken(token);

    const admin = await Admin.findById(decoded.id).select("-password");
    if (!admin) {
      return res.status(401).json({ message: "Admin not found" });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error("JWT Error:", error.message);
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

module.exports = {
  protect,
  protectHospital,
  protectRecipient,
  protectAdmin,
};
