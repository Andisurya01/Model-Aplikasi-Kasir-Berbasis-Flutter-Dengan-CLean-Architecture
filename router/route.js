const express = require('express');
const router = express.Router();

const auth = require('../src/api/authApi');
const user = require('../src/api/userApi');
const product = require('../src/api/productApi');
const transaction = require('../src/api/transactionApi');
const category = require('../src/api/category');

router.use('/auth', auth);
router.use('/users', user);
router.use('/products', product);
router.use('/transactions', transaction);
router.use('/categories', category);

module.exports = router;