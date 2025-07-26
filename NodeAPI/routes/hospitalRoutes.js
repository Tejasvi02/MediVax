const express = require('express');
const auth    = require('../middleware/authMiddleware');
const {
  createHospital,
  getHospitals,
  updateHospital,
  deleteHospital
} = require('../controllers/hospitalController');

const router = express.Router();

// Public (authenticated) read
router.get('/', auth, getHospitals);

// Admin‐only mutate
router.post('/', auth, (req,res,next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message:'Forbidden' });
  next();
}, createHospital);

router.put('/:id', auth, (req,res,next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message:'Forbidden' });
  next();
}, updateHospital);

router.delete('/:id', auth, (req,res,next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message:'Forbidden' });
  next();
}, deleteHospital);

module.exports = router;
