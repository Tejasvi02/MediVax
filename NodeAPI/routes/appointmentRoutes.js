const express = require('express');
const auth    = require('../middleware/authMiddleware');
const {
  createAppointment,
  getUserAppointments
} = require('../controllers/appointmentController');

const router = express.Router();

// all routes require login
router.use(auth);

// POST /api/appointments/    → create new
router.post('/', createAppointment);

// GET  /api/appointments/mine → list this user’s
router.get('/mine', getUserAppointments);

module.exports = router;
