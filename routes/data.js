const express = require('express');
const jwt = require('jsonwebtoken');
const { Token } = require('../models');
require('dotenv').config();

const router = express.Router();

// Middleware untuk autentikasi
const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });

    const token = authHeader.split(' ')[1];
    const tokenRecord = await Token.findOne({ where: { token } });

    if (!tokenRecord || tokenRecord.revoked) {
        return res.status(403).json({ message: 'Invalid or revoked token' });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token expired or invalid' });
    }
};

// Endpoint untuk mengakses data
router.get('/data', authenticate, (req, res) => {
    res.json({ message: 'Accessed protected data', userId: req.user.id });
});

module.exports = router;
