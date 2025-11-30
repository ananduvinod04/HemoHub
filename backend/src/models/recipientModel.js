const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const recipientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  age: { type: Number, required: true },
  medicalCondition: { type: String ,required:true},
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
recipientSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
recipientSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Recipient', recipientSchema);
