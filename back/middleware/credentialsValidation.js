// credentialsValidation.js
const User = require('../models/users');

const validateEmail = async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        // Check if the email already exists in the database
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Validate the email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Proceed to the next middleware if the email is unique and valid
        next();
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};

module.exports = validateEmail;