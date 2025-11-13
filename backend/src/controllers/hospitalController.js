const Hospital = require('../models/hospitalModel');
const BloodStock = require('../models/bloodStockModel');
const Appointment = require('../models/appointmentModel');
const RecipientRequest = require('../models/recipientRequestModel');
const DeleteLog = require('../models/deleteLogModel');
const generateToken = require('../utils/generateToken');
// Register Hospital
exports.registerHospital = async (req, res) => {
  try {
    const { hospitalName, email, password, licenseNumber, address } = req.body;
    const hospitalExists = await Hospital.findOne({ email });

    if (hospitalExists)
      return res.status(400).json({ success: false, message: 'Hospital already registered' });

    const hospital = await Hospital.create({ hospitalName, email, password, licenseNumber, address });
    const token = generateToken(hospital._id);

    // Set JWT as cookie
    res.cookie('token', token, {
      httpOnly: true,                       
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',                   
      maxAge: 30 * 24 * 60 * 60 * 1000       
    });

    res.status(201).json({
      success: true,
      message: 'Hospital registered successfully',
      _id: hospital._id,
      hospitalName: hospital.hospitalName,
      email: hospital.email,
      token
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login Hospital
exports.loginHospital = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hospital = await Hospital.findOne({ email });

    if (hospital && (await hospital.matchPassword(password))) {
      const token = generateToken(hospital._id);

      //Set cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000
      });

      res.status(200).json({
        success: true,
        message: 'Login successful',
        _id: hospital._id,
        hospitalName: hospital.hospitalName,
        email: hospital.email,
        token
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


//  View Profile
exports.getProfile = async (req, res) => {
  const hospital = await Hospital.findById(req.hospital._id).select('-password');
  if (hospital) res.json(hospital);
  else res.status(404).json({ message: 'Hospital not found' });
};

//  Update Profile
exports.updateProfile = async (req, res) => {
  const hospital = await Hospital.findById(req.hospital._id);
  if (hospital) {
    hospital.hospitalName = req.body.hospitalName || hospital.hospitalName;
    hospital.address = req.body.address || hospital.address;
    if (req.body.password) hospital.password = req.body.password;

    const updated = await hospital.save();
    res.json({ message: 'Hospital profile updated successfully', updated });
  } else res.status(404).json({ message: 'Hospital not found' });
};

// Add Blood Stock
exports.addBloodStock = async (req, res) => {
  try {
    const { bloodGroup, units, expiryDate } = req.body;
    const stock = await BloodStock.create({
      hospital: req.hospital._id,
      bloodGroup,
      units,
      expiryDate
    });
    res.status(201).json(stock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// View All Blood Stock
exports.getBloodStock = async (req, res) => {
  try {
    const stock = await BloodStock.find({ hospital: req.hospital._id });
    res.json(stock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Blood Stock
exports.updateBloodStock = async (req, res) => {
  try {
    const stock = await BloodStock.findById(req.params.id);
    if (!stock) return res.status(404).json({ message: 'Stock not found' });

    stock.units = req.body.units || stock.units;
    const updated = await stock.save();
    res.json({ message: 'Blood stock updated successfully', updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Blood Stock (Soft Delete)
exports.deleteBloodStock = async (req, res) => {
  try {
    const stock = await BloodStock.findById(req.params.id);
    if (!stock) return res.status(404).json({ message: 'Stock not found' });

    await DeleteLog.create({ itemType: 'BloodStock', deletedData: stock });
    await stock.deleteOne();

    res.json({ message: 'Stock deleted and logged for admin recovery' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  View Donor Appointments
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ hospitalName: req.hospital.hospitalName });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve or Reject Appointment
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    appointment.status = req.body.status || appointment.status;
    await appointment.save();
    res.json({ message: 'Appointment status updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// View Recipient Requests
exports.getRecipientRequests = async (req, res) => {
  try {
    const requests = await RecipientRequest.find({ hospital: req.hospital._id });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Recipient Request Status
exports.updateRequestStatus = async (req, res) => {
  try {
    const request = await RecipientRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = req.body.status || request.status;
    await request.save();
    res.json({ message: 'Recipient request updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Logout Hospital
exports.logoutHospital = async (req, res) => {
  try {
    // Clear cookie if you're storing JWT in cookies
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    // Optional: you can also log the event in your DB if needed
    res.status(200).json({ success: true, message: 'Hospital logged out successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Logout failed', error: error.message });
  }
};