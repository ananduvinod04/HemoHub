const mongoose = require('mongoose');

const recipientRequestSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipient', required: true },
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
  bloodGroup: { type: String, required: true },
  quantity: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Fulfilled', 'Rejected'], default: 'Pending' },
  requestType: { type: String, enum: ['Normal', 'Emergency'], default: 'Normal' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RecipientRequest', recipientRequestSchema);
