const jwt = require('jsonwebtoken');
const User = require('../models/users');


// Middleware to verify user credentials
const verifyToken = async (req, res, next) => {
    try {
        // Get the token from the request header
        const token = req.header('Authorization').replace('Bearer ', '');

        // Verify the token
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

        // Check if the decoded token contains the necessary information
        if (!decodedToken || !decodedToken.userId) {
            throw new Error('auth error');
        }

        // Find the user in the database using the decoded user ID
        const user = await User.findById(decodedToken.userId);
        // Check if the user exists
        if (!user) {
            throw new Error('auth error');
        }

        // Attach the user and decoded token to the request object
        req.userId = decodedToken.userId;

        // Proceed to the next middleware
        next();
    } catch (error) {
        res.status(401).json({ error });
    }
};

module.exports = verifyToken;