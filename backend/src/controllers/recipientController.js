const Recipient = require('../models/recipientModel');
const RecipientRequest = require('../models/recipientRequestModel');
const generateToken = require('../utils/generateToken');

// Register Recipient
exports.registerRecipient = async (req, res) => {
  try {
    const { name, email, password, bloodGroup, age, medicalCondition } = req.body;

    const existing = await Recipient.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Recipient already exists' });

    const recipient = await Recipient.create({ name, email, password, bloodGroup, age, medicalCondition });
    const token = generateToken(recipient._id);

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      success: true,
      message: 'Recipient registered successfully',
      _id: recipient._id,
      name: recipient.name,
      email: recipient.email,
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login Recipient
exports.loginRecipient = async (req, res) => {
  try {
    const { email, password } = req.body;
    const recipient = await Recipient.findOne({ email });

    if (recipient && (await recipient.matchPassword(password))) {
      const token = generateToken(recipient._id);

      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: 30 * 24 * 60 * 60 * 1000
      });

      res.json({
        success: true,
        message: 'Login successful',
        _id: recipient._id,
        name: recipient.name,
        email: recipient.email,
        token
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Get Profile
exports.getProfile = async (req, res) => {
  try {
    const recipient = await Recipient.findById(req.recipient._id).select('-password');
    res.json({ success: true, data: recipient });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const recipient = await Recipient.findById(req.recipient._id);
    if (!recipient) return res.status(404).json({ message: 'Recipient not found' });

    recipient.name = req.body.name || recipient.name;
    recipient.age = req.body.age || recipient.age;
    recipient.medicalCondition = req.body.medicalCondition || recipient.medicalCondition;

    const updated = await recipient.save();
    res.json({ success: true, message: 'Profile updated', data: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create Blood Request
exports.createRequest = async (req, res) => {
  try {
    const { hospital, bloodGroup, quantity, requestType, emergencyReason } = req.body;
    const newRequest = await RecipientRequest.create({
      recipient: req.recipient._id,
      hospital,
      bloodGroup,
      quantity,
      requestType,
      emergencyReason
    });
    res.status(201).json({ success: true, data: newRequest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// View All Requests
exports.getRequests = async (req, res) => {
  try {
    const requests = await RecipientRequest.find({ recipient: req.recipient._id }).populate('hospital', 'hospitalName');
    res.json({ success: true, total: requests.length, data: requests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Request (Soft Delete)
exports.deleteRequest = async (req, res) => {
  try {
    const request = await RecipientRequest.findOne({ _id: req.params.id, recipient: req.recipient._id });
    if (!request) return res.status(404).json({ message: 'Request not found' });

    await request.deleteOne();
    res.json({ success: true, message: 'Request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Recipient Dashboard Overview//Test by devoloper
exports.getDashboard = async (req, res) => {
  try {
    const recipientId = req.recipient._id;

    // Count total requests by this recipient
    const totalRequests = await RecipientRequest.countDocuments({
      recipient: recipientId,
    });

    // Get last 5 requests
    const recentRequests = await RecipientRequest.find({
      recipient: recipientId,
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("hospital", "hospitalName");

    res.json({
      success: true,
      data: {
        totalRequests,
        recentRequests,
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





// Logout
exports.logoutRecipient = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });
    res.json({ success: true, message: 'Recipient logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
