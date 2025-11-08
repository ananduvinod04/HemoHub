const Donor = require('../models/donorModel');
const Appointment = require('../models/appointmentModel');
const DeleteLog = require('../models/deleteLogModel');
const generateToken = require('../utils/generateToken');

// Register Donor
exports.registerDonor = async (req, res) => {
  try {
    const { name, email, password, bloodGroup, age, weight } = req.body;
    const donorExists = await Donor.findOne({ email });

    if (donorExists)
      return res.status(400).json({ message: 'Donor already exists' });

    const donor = await Donor.create({ name, email, password, bloodGroup, age, weight });
    const token = generateToken(donor._id);

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(201).json({
      _id: donor._id,
      name: donor.name,
      email: donor.email,
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login Donor
exports.loginDonor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const donor = await Donor.findOne({ email });

    if (donor && (await donor.matchPassword(password))) {
      const token = generateToken(donor._id);

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.json({
        _id: donor._id,
        name: donor.name,
        email: donor.email,
        token
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Donor Profile
exports.getProfile = async (req, res) => {
  const donor = await Donor.findById(req.donor._id);
  if (donor) {
    res.json(donor);
  } else {
    res.status(404).json({ message: 'Donor not found' });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  const donor = await Donor.findById(req.donor._id);

  if (donor) {
    donor.name = req.body.name || donor.name;
    donor.age = req.body.age || donor.age;
    donor.weight = req.body.weight || donor.weight;
    donor.bloodGroup = req.body.bloodGroup || donor.bloodGroup;

    if (req.body.password) {
      donor.password = req.body.password;
    }

    const updatedDonor = await donor.save();
    res.json(updatedDonor);
  } else {
    res.status(404).json({ message: 'Donor not found' });
  }
};

// Book Appointment
exports.bookAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.create({
      donor: req.donor._id,
      hospitalName: req.body.hospitalName,
      type: req.body.type,
      date: req.body.date,
    });
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// View Dashboard (stats & history)
exports.getDashboard = async (req, res) => {
  const donorId = req.donor._id;
  const totalAppointments = await Appointment.countDocuments({ donor: donorId });
  const recentAppointments = await Appointment.find({ donor: donorId }).sort({ date: -1 }).limit(5);

  res.json({
    totalAppointments,
    recentAppointments,
    eligibilityStatus: req.donor.eligibilityStatus,
    lastDonationDate: req.donor.lastDonationDate,
  });
};

// Delete (Cancel) Appointment
exports.deleteAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      donor: req.donor._id, // ensure donor owns it
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found or unauthorized' });
    }

    // Save appointment details in delete log before deletion
    await DeleteLog.create({
      itemType: 'Appointment',
      deletedData: appointment,
    });



     // Delete appointment
    await appointment.deleteOne();

    res.json({ message: 'Appointment deleted successfully and logged for admin recovery' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Soft Delete Donor
exports.deleteDonor = async (req, res) => {
  const donor = await Donor.findById(req.donor._id);
  if (!donor) return res.status(404).json({ message: 'Donor not found' });

  await DeleteLog.create({ itemType: 'Donor', deletedData: donor });
  await donor.deleteOne();

  res.json({ message: 'Donor deleted and logged for recovery' });
};
