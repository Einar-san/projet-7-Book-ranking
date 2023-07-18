const argon2 = require("argon2");
const User = require("../models/users");
const jwt = require("jsonwebtoken");


const signup = async (req, res) => {
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
}

const login = (req, res) => {
    try {
        // Generate a JWT token, token duration "1 hour"
        const token = jwt.sign({ userId: req.user._id }, process.env.SECRET_KEY, {
            expiresIn: '1h',
        });
        const userId = req.user

        res.status(200).json({ message: 'Login successful', userId, token});
    } catch (error) {
        res.status(500).json({ error: 'An error in auth.js occurred' });
    }
}

module.exports = { signup, login }