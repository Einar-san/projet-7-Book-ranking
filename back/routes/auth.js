// auth.js
const express = require('express');
const argon2 = require('argon2');
const User = require('../models/users');
const jwt = require('jsonwebtoken');
const validateEmail = require('../middlewares/credentialsValidation');
const {authenticateUser} = require('../middlewares/authenticateUser');

const router = express.Router();


router.post('/signup', validateEmail, async (req, res) => {
    try {
        const { email, password } = req.body;

        // Hash the password using Argon2
        const hashedPassword = await argon2.hash(password);

        // Create a new user document
        const newUser = new User({
            email,
            password: hashedPassword,
        });

        // Save the user to the database
        const savedUser = await newUser.save();

        res.status(201).json({ message: 'User created successfully', user: savedUser });

    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});


// Login
router.post('/login', authenticateUser, (req, res) => {
    try {
        // Generate a JWT token
        const token = jwt.sign({ userId: req.user._id}, process.env.SECRET_KEY);
        const userId = req.user

        res.status(200).json({ message: 'Login successful', userId, token});
    } catch (error) {
        res.status(500).json({ error: 'An error in auth.js occurred' });
    }
});


module.exports = router;