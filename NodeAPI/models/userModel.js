const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  age: { type: Number },
  profession: { type: String },
  contact: { type: String },
  address: { type: String },
  gender: { type: String },
  disease: { type: [String], default: [] },
  medicalCertificate: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
