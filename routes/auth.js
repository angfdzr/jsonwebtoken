const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Token } = require('../models');
require('dotenv').config();

const router = express.Router();

// Registrasi
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword });
    res.json({ message: 'User registered', user });
});

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    await Token.create({ token, UserId: user.id });

    res.json({ message: 'Login successful', token });
});

// Logout (Revoke Token)
router.post('/logout', async (req, res) => {
    const { token } = req.body;
    const tokenRecord = await Token.findOne({ where: { token } });
    if (tokenRecord) {
        tokenRecord.revoked = true;
        await tokenRecord.save();
    }
    res.json({ message: 'Token revoked' });
});

module.exports = router;
