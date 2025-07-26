const express = require('express');
const auth    = require('../middleware/authMiddleware');
const {
  createAppointment,
  getUserAppointments,
  getAppointmentById,
  getPendingAppointments,
  approveAppointment,
  rejectAppointment,
  payAppointment,
  getVaccinatedAppointments
} = require('../controllers/appointmentController');

const router = express.Router();
router.use(auth);

// Admin‐only helpers
const adminGuard = (req, res, next) => {
  if (req.user.role !== 'admin')
    return res.status(403).json({ message: 'Forbidden' });
  next();
};

// ——— Admin static routes ———
router.get('/pending',    adminGuard, getPendingAppointments);
router.get('/vaccinated', adminGuard, getVaccinatedAppointments);
router.put('/:id/approve', adminGuard, approveAppointment);
router.put('/:id/reject',  adminGuard, rejectAppointment);

// ——— User routes ———
router.post('/',          createAppointment);
router.get('/mine',       getUserAppointments);

// ——— Single & pay routes ———
router.get('/:id',        getAppointmentById);
router.put('/:id/pay',    payAppointment);

module.exports = router;
