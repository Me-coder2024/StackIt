const express = require('express');
const { body } = require('express-validator');
const { register, login, getProfile } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const registerValidation = [
    body('username').isLength({ min: 3, max: 50 }).trim().escape(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
];

const loginValidation = [
    body('email').isEmail().normalizeEmail(),
    body('password').exists()
];

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/profile', authenticateToken, getProfile);

module.exports = router;