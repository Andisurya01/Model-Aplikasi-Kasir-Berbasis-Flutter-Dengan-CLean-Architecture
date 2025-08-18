const express = require('express');
const router = express.Router();

const auth = require('../src/api/authApi');
const user = require('../src/api/userApi');
const product = require('../src/api/productApi');
const transaction = require('../src/api/transactionApi');
const category = require('../src/api/categoryApi');
const payment = require('../src/api/paymentApi');

router.use('/auth', auth);
router.use('/users', user);
router.use('/products', product);
router.use('/transactions', transaction);
router.use('/categories', category);
router.use('/payments', payment);

module.exports = router;