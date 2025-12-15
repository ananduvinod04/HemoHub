const jwt = require('jsonwebtoken');
const Donor = require('../models/donorModel');
const Hospital = require('../models/hospitalModel');
const Admin = require('../models/adminModel');
const Recipient = require('../models/recipientModel');


// Helper: extract token safely

const getToken = (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    return req.headers.authorization.split(' ')[1];
  }

  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }

  return null;
};


// Donor Authentication

const protect = async (req, res, next) => {
  const token = getToken(req);

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const donor = await Donor.findById(decoded.id).select('-password');
    if (!donor) {
      return res.status(401).json({ message: 'Donor not found' });
    }

    req.donor = donor;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};

// Hospital Authentication

const protectHospital = async (req, res, next) => {
  const token = getToken(req);

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const hospital = await Hospital.findById(decoded.id).select('-password');
    if (!hospital) {
      return res
        .status(401)
        .json({ success: false, message: 'Hospital not found' });
    }

    req.hospital = hospital;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: 'Not authorized, invalid token' });
  }
};

// Recipient Authentication

const protectRecipient = async (req, res, next) => {
  const token = getToken(req);

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const recipient = await Recipient.findById(decoded.id).select('-password');
    if (!recipient) {
      return res.status(401).json({ message: 'Recipient not found' });
    }

    req.recipient = recipient;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};


// Admin Authentication

const protectAdmin = async (req, res, next) => {
  const token = getToken(req);

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) {
      return res
        .status(401)
        .json({ success: false, message: 'Admin not found' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error('JWT Error:', error.message);
    return res
      .status(401)
      .json({ success: false, message: 'Not authorized, invalid token' });
  }
};

module.exports = {
  protect,
  protectHospital,
  protectRecipient,
  protectAdmin
};
