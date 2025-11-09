const mongoose = require('mongoose');

const bloodStockSchema = new mongoose.Schema({
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
  bloodGroup: { type: String, required: true },
  units: { type: Number, required: true },
  expiryDate: { type: Date, required: true },
  status: { type: String, enum: ['Available', 'Expired'], default: 'Available' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BloodStock', bloodStockSchema);
