const User = require('../models/users');

const validateEmail = async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        const missingEmailError = new Error('Email is required');
        missingEmailError.statusCode = 400;
        throw missingEmailError;
    }

    try {
        // Check if the email already exists in the database
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const existingEmailError = new Error('Email already exists');
            existingEmailError.statusCode = 400;
            throw existingEmailError;
        }

        // Validate the email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            const invalidEmailError = new Error('Invalid email format');
            invalidEmailError.statusCode = 400;
            throw invalidEmailError;
        }

        // Proceed to the next middlewares if the email is unique and valid
        next();
    } catch (error) {
        if (error.statusCode) {
            // If custom error with status code, send the specific error message and status code
            res.status(error.statusCode).json({ error });
        } else {
            // For other errors, set status code to 500 and send the error
            res.status(500).json({ error });
        }
    }
};

module.exports = validateEmail;