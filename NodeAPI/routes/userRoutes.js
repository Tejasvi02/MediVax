const express = require('express');
const multer = require('multer');
const path = require('path');
const User = require('../models/userModel');


const router = express.Router();

// Storage configuration
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './uploads');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// @route POST /api/users/register
router.post('/register', upload.single('medicalCertificate'), async (req, res) => {
  try {
    const {
      name,
      email,
      age,
      profession,
      contact,
      address,
      gender,
      disease
    } = req.body;

    const medicalCertificate = req.file ? req.file.filename : null;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const user = new User({
      name,
      email,
      age,
      profession,
      contact,
      address,
      gender,
      disease,
      medicalCertificate,
      role: 'user', // default
    });

    const createdUser = await user.save();
    res.status(201).json(createdUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

module.exports = router;


