const express = require('express');
const multer = require('multer');
const path = require('path');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


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
      disease,
      password, 
    } = req.body;

    console.log('password from req.body:', password)

    const medicalCertificate = req.file ? req.file.filename : null;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    console.log('password from req.body:', password); // check if it's undefined

    const hashedPassword = await bcrypt.hash(password, 10); // hash it

    const user = new User({
      name,
      email,
      age,
      profession,
      contact,
      address,
      gender,
      disease: JSON.parse(disease),
      password: hashedPassword,
      medicalCertificate,
      role: 'user',
    });

    const createdUser = await user.save();

    // create token
    const token = jwt.sign({ id: createdUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(201).json({
      token,
      user: {
        _id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        role: createdUser.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});


const authMiddleware = require('../middleware/authMiddleware');

router.get('/profile', authMiddleware, async (req, res) => {
  res.json(req.user);
});

// @route POST /api/users/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

module.exports = router;


