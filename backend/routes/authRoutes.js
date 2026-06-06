const express = require('express');
const { registerUser, loginUser, logoutUser, checkSession } = require('../controllers/authController');
const { 
  registerValidationRules, 
  loginValidationRules, 
  validateRequest 
} = require('../middleware/validationMiddleware');
const { rateLimiter } = require('../middleware/rateLimitMiddleware');

const router = express.Router();

// Limit IPs to 100 logins/registrations per 15 minutes
const authLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 100,
  message: 'Too many login attempts. Please try again in 15 minutes.'
});

router.post('/register', authLimiter, registerValidationRules, validateRequest, registerUser);
router.post('/login', authLimiter, loginValidationRules, validateRequest, loginUser);
router.post('/logout', logoutUser);
router.get('/me', checkSession);

module.exports = router;
