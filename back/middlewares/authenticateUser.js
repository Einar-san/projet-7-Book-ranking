const argon2 = require('argon2');
const User = require('../models/users');


// Middleware for user authentication
const authenticateUser = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Verify the password
        const isPasswordValid = await argon2.verify(user.password, password);
        if (!isPasswordValid) {
            const wrongPasswordError = new Error('Invalid email or password')
            wrongPasswordError.statusCode = 401
            throw wrongPasswordError
        }

        // Attach the user object to the request for further use
        req.user =  user._id


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

module.exports = {
    authenticateUser,
};