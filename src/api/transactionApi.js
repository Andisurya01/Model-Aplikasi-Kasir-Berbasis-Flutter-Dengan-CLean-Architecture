const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const webhookController = require('../controllers/webhookController');
const { authorize } = require('../middleware/auth');

router
    .post('/cash', transactionController.createCashTransaction)
    .post('/midtrans', authorize, transactionController.createMidtransTransaction)
    .post('/midtrans/notification', webhookController.midtransNotification)
    .post('/status', transactionController.updateTransactionStatus)
    .get('/:id', transactionController.getTransactionById)
    .get('/', transactionController.getAllTransactions);


module.exports = router;
