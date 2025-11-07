const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const donorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  age: { type: Number, required: true },
  weight: { type: Number, required: true },
  lastDonationDate: { type: Date, default: null },
  eligibilityStatus: { type: String, default: 'Eligible' }, // Eligible or Not Eligible
  createdAt: { type: Date, default: Date.now },
});

// Hash password before saving
donorSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
donorSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Donor', donorSchema);
