// auth.js
const express = require('express');
const validateEmail = require('../middlewares/credentialsValidation');
const {authenticateUser} = require('../middlewares/authenticateUser');
const {signup, login} = require("../controllers/authController");

const router = express.Router();

// Signup
router.post('/signup', validateEmail, signup);


// Login
router.post('/login', authenticateUser, login);


module.exports = router;