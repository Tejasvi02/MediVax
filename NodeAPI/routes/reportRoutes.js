// server/routes/reportRoutes.js

const express = require('express');
const auth    = require('../middleware/authMiddleware');
const {
  getAgeReport,
  getGenderReport,
  getDailyDosesReport,
  getCoverageReport,
  getMonthlyTrend,
  getVaccineDistribution,
  getMonthlyGender
} = require('../controllers/reportController');

const router = express.Router();

// require a valid JWT on all report routes
router.use(auth);

// admin‑only guard
const adminGuard = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};

// age buckets
router.get('/age', adminGuard, getAgeReport);
// gender pie
router.get('/gender', adminGuard, getGenderReport);
// daily doses bar
router.get('/daily', adminGuard, getDailyDosesReport);
// coverage %
router.get('/coverage', adminGuard, getCoverageReport);

// monthly trend line
router.get('/monthly-trend', adminGuard, getMonthlyTrend);
// vaccine distribution pie
router.get('/vaccine-distribution', adminGuard, getVaccineDistribution);
// monthly gender grouped bar
router.get('/monthly-gender', adminGuard, getMonthlyGender);

module.exports = router;
