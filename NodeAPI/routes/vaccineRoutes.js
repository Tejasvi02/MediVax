const express = require('express');
const auth = require('../middleware/authMiddleware');
const {
  createVaccine,
  getVaccines,
  updateVaccine,
  deleteVaccine
} = require('../controllers/vaccineController');

const router = express.Router();

// All admin‐only
router.use(auth, (req, res, next) => {
  if (req.user.role !== 'admin')
    return res.status(403).json({ message: 'Forbidden' });
  next();
});

router.route('/')
  .post(createVaccine)
  .get(getVaccines);

router.route('/:id')
  .put(updateVaccine)
  .delete(deleteVaccine);

module.exports = router;
