const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  address:  { type: String },
  type:     { type: String, enum: ['Govt', 'Private'], required: true },
  charges:  { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Hospital', hospitalSchema);
