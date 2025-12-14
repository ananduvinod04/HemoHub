const Admin = require('../models/adminModel');
const Donor = require('../models/donorModel');
const Hospital = require('../models/hospitalModel');
const Recipient = require('../models/recipientModel');
const DeleteLog = require('../models/deleteLogModel');
const BloodStock = require('../models/bloodStockModel');
const RecipientRequest = require('../models/recipientRequestModel');
const Appointment = require('../models/appointmentModel');
const generateToken = require('../utils/generateToken');


// Register Admin (Super Admin only)
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const admin = await Admin.create({ name, email, password });

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      _id: admin._id,
      name: admin.name,
      email: admin.email
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ===============================
// Login Admin
// ===============================
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (admin && (await admin.matchPassword(password))) {
      const token = generateToken(admin._id);

      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: 30 * 24 * 60 * 60 * 1000
      });

      res.json({
        success: true,
        message: 'Admin login successful',
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        token
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get Admin Profile
exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select('-password');
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    res.status(200).json({ success: true, data: admin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ===============================
// Update Admin Profile
// ===============================
exports.updateAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    admin.name = req.body.name || admin.name;
    admin.email = req.body.email || admin.email;
    if (req.body.password) admin.password = req.body.password;

    const updated = await admin.save();
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Admin Dashboard Overview
exports.getDashboard = async (req, res) => {
  try {
    const donors = await Donor.countDocuments();
    const hospitals = await Hospital.countDocuments();
    const recipients = await Recipient.countDocuments();
    const requests = await RecipientRequest.countDocuments();
    const donations = await Appointment.countDocuments();

    res.json({
      success: true,
      data: {
        totalDonors: donors,
        totalHospitals: hospitals,
        totalRecipients: recipients,
        totalRequests: requests,
        totalDonations: donations
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// View All Users
exports.getAllUsers = async (req, res) => {
  try {
    const donors = await Donor.find().select('-password');
    const hospitals = await Hospital.find().select('-password');
    const recipients = await Recipient.find().select('-password');

    res.json({
      success: true,
      donors,
      hospitals,
      recipients
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ===============================
// Update User (Donor / Hospital / Recipient)
// ===============================
exports.updateUser = async (req, res) => {
  try {
    const { type, id } = req.params;
    let updatedUser;

    if (type === 'donor') {
      updatedUser = await Donor.findByIdAndUpdate(id, req.body, { new: true }).select('-password');
    } else if (type === 'hospital') {
      updatedUser = await Hospital.findByIdAndUpdate(id, req.body, { new: true }).select('-password');
    } else if (type === 'recipient') {
      updatedUser = await Recipient.findByIdAndUpdate(id, req.body, { new: true }).select('-password');
    } else {
      return res.status(400).json({ success: false, message: 'Invalid user type' });
    }

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      message: `${type} updated successfully`,
      data: updatedUser
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get All Donor Appointments (Admin)
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('donor', 'name bloodGroup age')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      total: appointments.length,
      data: appointments
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Update Donor Appointment (Admin)
exports.updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatus = ['Pending', 'Approved', 'Completed', 'Cancelled'];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid appointment status' });
    }

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    appointment.status = status;
    await appointment.save();

    res.json({
      success: true,
      message: `Appointment updated to ${status}`,
      data: appointment
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Delete Donor Appointment (Admin)
exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findByIdAndDelete(id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    await DeleteLog.create({
      itemType: 'appointment',
      deletedData: appointment
    });

    res.json({
      success: true,
      message: 'Appointment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ===============================
// Get All Recipient Requests (Admin)
// ===============================
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await RecipientRequest.find()
      .populate('recipient', 'name bloodGroup')
      .populate('hospital', 'hospitalName');

    res.json({
      success: true,
      total: requests.length,
      data: requests
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Update Recipient Request Status (Admin)
exports.updateRecipientRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatus = ['Pending', 'Approved', 'Fulfilled', 'Rejected'];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid request status' });
    }

    const request = await RecipientRequest.findById(id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Recipient request not found' });
    }

    request.status = status;
    await request.save();

    res.json({
      success: true,
      message: `Request updated to ${status}`,
      data: request
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// 🔥 Delete Recipient Request (Admin)
exports.deleteRecipientRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await RecipientRequest.findByIdAndDelete(id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Recipient request not found'
      });
    }

    await DeleteLog.create({
      itemType: 'recipientRequest',
      deletedData: request
    });

    res.json({
      success: true,
      message: 'Recipient request deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// Blood Stock Management
exports.getAllBloodStock = async (req, res) => {
  try {
    const stocks = await BloodStock.find().populate('hospital', 'hospitalName');
    res.json({ success: true, total: stocks.length, data: stocks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBloodStock = async (req, res) => {
  try {
    const stock = await BloodStock.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!stock) {
      return res.status(404).json({ success: false, message: 'Blood stock not found' });
    }

    res.json({
      success: true,
      message: 'Blood stock updated successfully',
      data: stock
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// Delete & Restore Users

exports.deleteUser = async (req, res) => {
  try {
    const { type, id } = req.params;
    let deletedUser;

    if (type === 'donor') deletedUser = await Donor.findByIdAndDelete(id);
    else if (type === 'hospital') deletedUser = await Hospital.findByIdAndDelete(id);
    else if (type === 'recipient') deletedUser = await Recipient.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: `${type} not found` });
    }

    await DeleteLog.create({ itemType: type, deletedData: deletedUser });
    res.json({ success: true, message: `${type} deleted and logged successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDeleteLogs = async (req, res) => {
  try {
    const logs = await DeleteLog.find().sort({ deletedAt: -1 });
    res.json({ success: true, total: logs.length, data: logs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.restoreFromDeleteLogs = async (req, res) => {
  try {
    const log = await DeleteLog.findById(req.params.id);
    if (!log) return res.status(404).json({ message: 'Log not found' });

    const { itemType, deletedData } = log;

    if (itemType === 'donor') await Donor.create(deletedData);
    else if (itemType === 'hospital') await Hospital.create(deletedData);
    else if (itemType === 'recipient') await Recipient.create(deletedData);

    await DeleteLog.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: `${itemType} restored successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Logout Admin

exports.logoutAdmin = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });
    res.json({ success: true, message: 'Admin logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
