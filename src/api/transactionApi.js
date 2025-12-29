const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const webhookController = require('../controllers/webhookController');
const { authorize } = require('../middleware/auth');

router
    .post('/cash', authorize, transactionController.createCashTransaction)
    .post('/midtrans', authorize, transactionController.createMidtransTransaction)
    .post('/midtrans/notification', webhookController.midtransNotification)
    .post('/status', transactionController.updateTransactionStatus)
    .get('/:id', transactionController.getTransactionById)
    .get('/', transactionController.getAllTransactions)
    .get('/status/pending', transactionController.getPendingTransactions)
    .get('/data/filters', transactionController.getTransactionsWithFilters)
    .get("/midtrans/payment/success", transactionController.midtransSuccess)
    .get("/midtrans/payment/failed", transactionController.midtransFailed)
    .get("/midtrans/payment/pending", transactionController.midtransPending);

module.exports = router;
