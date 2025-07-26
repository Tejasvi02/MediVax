const Appointment = require('../models/appointmentModel');
const Vaccine     = require('../models/vaccineModel');
const Hospital    = require('../models/hospitalModel');
const User        = require('../models/userModel');

// 1. User requests appointment (no pay, no approve)
exports.createAppointment = async (req, res) => {
  try {
    const { hospitalId, vaccineId, appointmentDate } = req.body;
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
      approved: false,
      paid: false
    });
    await appt.save();
    res.status(201).json(appt);
  } catch (err) {
    console.error('Create appointment error:', err);
    res.status(500).json({ message: err.message });
  }
};

// 2. User lists all their appointments
exports.getUserAppointments = async (req, res) => {
  try {
    const list = await Appointment
      .find({ user: req.user._id })
      .populate('hospital')
      .populate('vaccine')
      .sort({ appointmentDate: 1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 3. Single appointment (for payment page)
exports.getAppointmentById = async (req, res) => {
  try {
    const appt = await Appointment
      .findById(req.params.id)
      .populate('hospital')
      .populate('vaccine');
    if (!appt) return res.status(404).json({ message: 'Not found' });
    if (appt.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Forbidden' });
    res.json(appt);
  } catch (err) {
    console.error('getAppointmentById error:', err);
    res.status(500).json({ message: err.message });
  }
};


// 4. Admin: list pending requests
exports.getPendingAppointments = async (req, res) => {
  try {
    const list = await Appointment
      .find({ approved: false,  rejected: false })
      .populate('user', 'name email')
      .populate('hospital')
      .populate('vaccine')
      .sort({ appointmentDate: 1 });
    res.json(list);
  } catch (err) {
    console.error('getPendingAppointments error:', err);
    res.status(500).json({ message: err.message });
  }
};
// 5. Admin: approve
exports.approveAppointment = async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ message: 'Not found' });
    appt.approved = true;
    await appt.save();
    res.json(appt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 6. Admin: reject
exports.rejectAppointment = async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ message: 'Not found' });
    //await Appointment.findByIdAndDelete(req.params.id); - if we want to delete the appoitment after rejection
    appt.rejected = true;
    await appt.save();
    res.json({ message: 'Rejected' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 7. User: pay
exports.payAppointment = async (req, res) => {
  try {
    const appt = await Appointment
      .findById(req.params.id)
      .populate('hospital')
      .populate('vaccine');
    if (!appt) return res.status(404).json({ message: 'Not found' });
    if (appt.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Forbidden' });
    if (!appt.approved)   return res.status(400).json({ message: 'Not approved yet' });
    if (appt.paid)        return res.status(400).json({ message: 'Already paid' });

    // compute cost
    const cost = appt.hospital.charges + appt.vaccine.price;
    appt.cost = cost;
    appt.paid = true;
    await appt.save();
    res.json(appt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getVaccinatedAppointments = async (req, res) => {
  try {
    // aggregate on paid, non-rejected appointments
    const agg = await Appointment.aggregate([
      { $match: { paid: true, rejected: false } },
      {
        $group: {
          _id: {
            user: '$user',
            vaccine: '$vaccine',
            hospital: '$hospital'
          },
          dosageCount: { $sum: 1 }
        }
      },
      // lookup user
      {
        $lookup: {
          from: 'users',
          localField: '_id.user',
          foreignField: '_id',
          as: 'userDoc'
        }
      },
      { $unwind: '$userDoc' },
      // lookup vaccine
      {
        $lookup: {
          from: 'vaccines',
          localField: '_id.vaccine',
          foreignField: '_id',
          as: 'vaccineDoc'
        }
      },
      { $unwind: '$vaccineDoc' },
      // lookup hospital
      {
        $lookup: {
          from: 'hospitals',
          localField: '_id.hospital',
          foreignField: '_id',
          as: 'hospitalDoc'
        }
      },
      { $unwind: '$hospitalDoc' },
      // project the shape
      {
        $project: {
          _id: 0,
          user: {
            _id: '$userDoc._id',
            name: '$userDoc.name',
            email: '$userDoc.email'
          },
          vaccine: {
            _id: '$vaccineDoc._id',
            name: '$vaccineDoc.name'
          },
          hospital: {
            _id: '$hospitalDoc._id',
            name: '$hospitalDoc.name'
          },
          dosageCount: 1
        }
      }
    ]);

    res.json(agg);
  } catch (err) {
    console.error('getVaccinatedAppointments error:', err);
    res.status(500).json({ message: err.message });
  }
};

// User: get count of bookings per vaccine
exports.getUserDoseCounts = async (req, res) => {
  try {
    const userId = req.user._id;

    // Aggregate appointments by vaccine
    const counts = await Appointment.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$vaccine', count: { $sum: 1 } } }
    ]);

    // Format response as array of { vaccineId, count }
    const result = counts.map(c => ({
      vaccineId: c._id.toString(),
      count: c.count
    }));

    res.json(result);
  } catch (err) {
    console.error('getUserDoseCounts error:', err);
    res.status(500).json({ message: err.message });
  }
};
