// server/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper functions to promisify NeDB operations
const findOneAsync = (query) => new Promise((resolve, reject) => {
    console.log('findOneAsync called with query:', query);
    User.findOne(query, (err, doc) => {
        console.log('findOne callback:', err, doc);
        if (err) reject(err);
        else resolve(doc);
    });
});

const insertAsync = (doc) => new Promise((resolve, reject) => {
    console.log('insertAsync called with doc:', doc);
    User.insert(doc, (err, newDoc) => {
        console.log('insert callback:', err, newDoc);
        if (err) reject(err);
        else resolve(newDoc);
    });
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await findOneAsync({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser = {
            username,
            email,
            password: hashedPassword,
            subscribers: 0,
            createdAt: new Date()
        };

        const user = await insertAsync(newUser);

        // Create token
        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            token,
            user: { id: user._id, username: user.username, email: user.email }
        });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});
// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await findOneAsync({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: { id: user._id, username: user.username, email: user.email }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;