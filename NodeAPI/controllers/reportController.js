// server/controllers/reportController.js

const Appointment = require('../models/appointmentModel');
const User        = require('../models/userModel');
const Vaccine     = require('../models/vaccineModel');

/**
 * Age distribution in 10‑year buckets
 */
exports.getAgeReport = async (req, res) => {
  try {
    const agg = await User.aggregate([
      { $lookup: {
          from: 'appointments',
          localField: '_id',
          foreignField: 'user',
          as: 'appts'
        }
      },
      { $unwind: '$appts' },
      { $match: { 'appts.paid': true, 'appts.rejected': false } },
      { $bucket: {
          groupBy: '$age',
          boundaries: [0,10,20,30,40,50,60,70,80,90,100,200],
          default: '100+',
          output: { count: { $sum: 1 } }
        }
      }
    ]);

    // Convert numeric boundaries to labels
    const labeled = agg.map(d => {
      if (d._id === '100+') {
        return { ageGroup: '100+', count: d.count };
      }
      const start = d._id;
      const end   = start + 9;
      return { ageGroup: `${start}–${end}`, count: d.count };
    });

    res.json(labeled);
  } catch (err) {
    console.error('getAgeReport error:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Gender distribution pie
 */
exports.getGenderReport = async (req, res) => {
  try {
    const agg = await User.aggregate([
      { $lookup: {
          from: 'appointments',
          localField: '_id',
          foreignField: 'user',
          as: 'appts'
        }
      },
      { $unwind: '$appts' },
      { $match: { 'appts.paid': true, 'appts.rejected': false } },
      { $group: { _id: '$gender', count: { $sum: 1 } } }
    ]);
    res.json(agg);
  } catch (err) {
    console.error('getGenderReport error:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Daily doses bar
 */
exports.getDailyDosesReport = async (req, res) => {
  try {
    const agg = await Appointment.aggregate([
      { $match: { paid: true, rejected: false } },
      { $group: {
          _id: { 
            $dateToString: { format: '%Y-%m-%d', date: '$appointmentDate' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);
    res.json(agg);
  } catch (err) {
    console.error('getDailyDosesReport error:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Coverage percentage
 */
exports.getCoverageReport = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const vaccinatedUsers = await Appointment.distinct('user', {
      paid: true,
      rejected: false
    });
    const coveredCount = vaccinatedUsers.length;
    const percent = totalUsers
      ? Number(((coveredCount / totalUsers) * 100).toFixed(2))
      : 0;
    res.json({ totalUsers, coveredCount, percent });
  } catch (err) {
    console.error('getCoverageReport error:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Monthly vaccination trend (line chart)
 */
exports.getMonthlyTrend = async (req, res) => {
  try {
    const agg = await Appointment.aggregate([
      { $match: { paid: true, rejected: false } },
      { $group: {
          _id: {
            year:  { $year: '$appointmentDate' },
            month: { $month: '$appointmentDate' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const result = agg.map(d => {
      const m = String(d._id.month).padStart(2, '0');
      return { month: `${d._id.year}-${m}`, count: d.count };
    });
    res.json(result);
  } catch (err) {
    console.error('getMonthlyTrend error:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Vaccine type distribution (pie chart)
 */
exports.getVaccineDistribution = async (req, res) => {
  try {
    const agg = await Appointment.aggregate([
      { $match: { paid: true, rejected: false } },
      { $group: { _id: '$vaccine', count: { $sum: 1 } } },
      { $lookup: {
          from: 'vaccines',
          localField: '_id',
          foreignField: '_id',
          as: 'vax'
        }
      },
      { $unwind: '$vax' },
      { $project: { _id: 0, vaccine: '$vax.name', count: 1 } }
    ]);
    res.json(agg);
  } catch (err) {
    console.error('getVaccineDistribution error:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Monthly gender breakdown (grouped bar)
 */
exports.getMonthlyGender = async (req, res) => {
  try {
    const agg = await Appointment.aggregate([
      { $match: { paid: true, rejected: false } },
      { $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'usr'
        }
      },
      { $unwind: '$usr' },
      { $group: {
          _id: {
            year:   { $year: '$appointmentDate' },
            month:  { $month: '$appointmentDate' },
            gender: '$usr.gender'
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const result = agg.map(d => {
      const m = String(d._id.month).padStart(2, '0');
      return {
        month:  `${d._id.year}-${m}`,
        gender: d._id.gender,
        count:  d.count
      };
    });
    res.json(result);
  } catch (err) {
    console.error('getMonthlyGender error:', err);
    res.status(500).json({ message: err.message });
  }
};
