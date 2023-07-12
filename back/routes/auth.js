// auth.js
const express = require('express');
const argon2 = require('argon2');
const User = require('../models/users');
const validateEmail = require('../middleware/credentialsValidation');

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

module.exports = router;