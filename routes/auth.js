const express = require('express');
const jwt = require('jsonwebtoken');
const authenticateJWT = require('../middleware/authenticateJWT');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const router = express.Router();

// Register a new user
router.post('/register', authenticateJWT, async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const checkEmailExist = await User.findUserByEmail(email);
    if(checkEmailExist) return res.status(400).json({ message: 'Email already exist.' });
    const userId = await User.createUser(name, email, password);
    res.status(201).json({ message: 'User registered successfully', userId });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findUserByEmail(email);
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const accessToken = jwt.sign({ id: user.id, email: user.email, role: user.role }, 'secretKey', { expiresIn: '1d' });
    res.json({ accessToken });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

module.exports = router;
