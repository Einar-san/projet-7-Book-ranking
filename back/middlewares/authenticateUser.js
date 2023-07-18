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
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Attach the user object to the request for further use
        req.user =  user._id


        next();
    } catch (error) {
        res.status(500).json({ error: 'An error in the middlewares auth occurred' });
    }
};

module.exports = {
    authenticateUser,
};