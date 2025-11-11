const Admin = require('../models/adminModel');
const Donor = require('../models/donorModel');
const Hospital = require('../models/hospitalModel');
const Recipient = require('../models/recipientModel');
const DeleteLog = require('../models/deleteLogModel');
const BloodStock = require('../models/bloodStockModel');
const RecipientRequest = require('../models/recipientRequestModel');
const Appointment = require('../models/appointmentModel');
const generateToken = require('../utils/generateToken');

// 1️⃣ Register Admin (Super Admin only)
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Admin already exists' });

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

// 2️⃣ Login Admin
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (admin && (await admin.matchPassword(password))) {
      const token = generateToken(admin._id);

      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
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


// 3️⃣ Get Admin Profile
exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select('-password');
    if (!admin) return res.status(404).json({ success: false, message: 'Admin not found' });

    res.status(200).json({ success: true, data: admin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4️⃣ Update Admin Profile (optional)
exports.updateAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    if (!admin) return res.status(404).json({ success: false, message: 'Admin not found' });

    admin.name = req.body.name || admin.name;
    admin.email = req.body.email || admin.email;
    if (req.body.password) admin.password = req.body.password;

    const updated = await admin.save();
    res.json({ success: true, message: 'Profile updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};




// 3️⃣ Admin Dashboard Overview
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

// 4️⃣ View All Users
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

// 5️⃣ Manage Blood Inventory (View All Stocks)
exports.getAllBloodStock = async (req, res) => {
  try {
    const stocks = await BloodStock.find().populate('hospital', 'hospitalName');
    res.json({ success: true, total: stocks.length, data: stocks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 6️⃣ Manage Requests (All recipient blood requests)
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await RecipientRequest.find()
      .populate('recipient', 'name bloodGroup')
      .populate('hospital', 'hospitalName');
    res.json({ success: true, total: requests.length, data: requests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 7️⃣ Delete User (Soft Delete)
exports.deleteUser = async (req, res) => {
  try {
    const { type, id } = req.params;
    let deletedUser;

    if (type === 'donor') deletedUser = await Donor.findByIdAndDelete(id);
    else if (type === 'hospital') deletedUser = await Hospital.findByIdAndDelete(id);
    else if (type === 'recipient') deletedUser = await Recipient.findByIdAndDelete(id);

    if (!deletedUser) return res.status(404).json({ message: `${type} not found` });

    await DeleteLog.create({ itemType: type, deletedData: deletedUser });
    res.json({ success: true, message: `${type} deleted and logged successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 8️⃣ View Delete Logs
exports.getDeleteLogs = async (req, res) => {
  try {
    const logs = await DeleteLog.find().sort({ deletedAt: -1 });
    res.json({ success: true, total: logs.length, data: logs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 9️⃣ Restore from Delete Logs
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

// 🔟 Logout
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
