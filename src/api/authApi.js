const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router
    .post('/login', authController.login)
    .post('/otp/generate', authController.generateOtp)
    .post('/otp/verify', authController.verifyOtp)
    .get('/logout', authController.logout);

module.exports = router;