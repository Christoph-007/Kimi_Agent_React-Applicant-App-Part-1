const express = require('express');
const router = express.Router();
const {
    employerSignup,
    applicantSignup,
    login,
    getMe,
    updateMe,
    updatePassword,
    logout,
    forgotPassword,
    resetPassword,
} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const { validate } = require('../middlewares/validationMiddleware');
const {
    employerSignupSchema,
    applicantSignupSchema,
    loginSchema,
} = require('../utils/validators');

// Public routes
router.post('/employer/signup', validate(employerSignupSchema), employerSignup);
router.post('/applicant/signup', validate(applicantSignupSchema), applicantSignup);
router.post('/login', validate(loginSchema), login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:resetToken', resetPassword);

// Protected routes
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);
router.put('/update-password', protect, updatePassword);
router.post('/logout', protect, logout);

module.exports = router;
