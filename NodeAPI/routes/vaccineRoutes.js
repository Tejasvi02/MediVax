const express = require('express');
const auth    = require('../middleware/authMiddleware');
const {
  createVaccine,
  getVaccines,
  updateVaccine,
  deleteVaccine
} = require('../controllers/vaccineController');

const router = express.Router();

// Public (authenticated) read
router.get('/', auth, getVaccines);

// Admin‐only mutate
router.post('/', auth, (req,res,next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message:'Forbidden' });
  next();
}, createVaccine);

router.put('/:id', auth, (req,res,next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message:'Forbidden' });
  next();
}, updateVaccine);

router.delete('/:id', auth, (req,res,next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message:'Forbidden' });
  next();
}, deleteVaccine);

module.exports = router;
