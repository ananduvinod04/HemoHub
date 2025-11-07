const mongoose = require('mongoose');

const deleteLogSchema = new mongoose.Schema({
  itemType: { type: String, required: true }, // 'Donor' or 'Appointment'
  deletedData: { type: Object, required: true },
  deletedAt: { type: Date, default: Date.now },
  recovered: { type: Boolean, default: false },
});

module.exports = mongoose.model('DeleteLog', deleteLogSchema);
