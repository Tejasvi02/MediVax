const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true
  },
  vaccine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vaccine',
    required: true
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  approved: {
    type: Boolean,
    default: false
  },
  paid: {
    type: Boolean,
    default: false
  },
  cost: {
    type: Number
  }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);

