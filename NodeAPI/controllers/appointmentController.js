const Appointment = require('../models/appointmentModel');
const Vaccine     = require('../models/vaccineModel');
const Hospital    = require('../models/hospitalModel');

exports.createAppointment = async (req, res) => {
  const { hospitalId, vaccineId, appointmentDate } = req.body;
  try {
    // validate hospital & vaccine
    const hospital = await Hospital.findById(hospitalId);
    const vaccine  = await Vaccine.findById(vaccineId);
    if (!hospital || !vaccine) {
      return res.status(400).json({ message: 'Invalid hospital or vaccine' });
    }

    const appt = new Appointment({
      user: req.user._id,
      hospital: hospitalId,
      vaccine: vaccineId,
      appointmentDate,
      paid: true
    });
    const created = await appt.save();
    // Populate for front‑end
    await created.populate('hospital').populate('vaccine').execPopulate();
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserAppointments = async (req, res) => {
  try {
    const list = await Appointment
      .find({ user: req.user._id })
      .populate('hospital')
      .populate('vaccine')
      .sort({ appointmentDate: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
