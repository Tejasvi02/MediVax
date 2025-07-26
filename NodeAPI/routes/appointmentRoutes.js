const express = require('express');
const auth    = require('../middleware/authMiddleware');
const {
  createAppointment,
  getUserAppointments,
  getAppointmentById,
  getPendingAppointments,
  approveAppointment,
  rejectAppointment,
  payAppointment
} = require('../controllers/appointmentController');

const router = express.Router();
router.use(auth);

// ADMIN STATIC ROUTES — must come before any '/:id' routes:
const adminGuard = (req, res, next) => {
  if (req.user.role !== 'admin')
    return res.status(403).json({ message: 'Forbidden' });
  next();
};

// list all pending requests
router.get('/pending',    adminGuard, getPendingAppointments);
// approve one
router.put('/:id/approve', adminGuard, approveAppointment);
// reject one
router.put('/:id/reject',  adminGuard, rejectAppointment);

// USER ROUTES
router.post('/',            createAppointment);
router.get('/mine',         getUserAppointments);

// now the dynamic '/:id' can safely match real IDs:
router.get('/:id',          getAppointmentById);
router.put('/:id/pay',      payAppointment);

module.exports = router;
