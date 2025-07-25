const express = require('express');
const auth = require('../middleware/authMiddleware');
const {
  createHospital,
  getHospitals,
  updateHospital,
  deleteHospital
} = require('../controllers/hospitalController');

const router = express.Router();

router.use(auth, (req, res, next) => {
  if (req.user.role !== 'admin')
    return res.status(403).json({ message: 'Forbidden' });
  next();
});

router.route('/')
  .post(createHospital)
  .get(getHospitals);

router.route('/:id')
  .put(updateHospital)
  .delete(deleteHospital);

module.exports = router;
