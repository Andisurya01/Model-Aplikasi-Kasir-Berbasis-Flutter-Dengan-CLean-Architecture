const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router
    .get('/', paymentController.findAllPayments)
    .get('/:id', paymentController.findPaymentById)
    .post('/', paymentController.createPayment)
    .put('/:id', paymentController.updatePayment);

module.exports = router;