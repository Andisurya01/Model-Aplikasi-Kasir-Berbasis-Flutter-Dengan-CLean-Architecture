const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router
    //revenue reports
    .get('/revenue/today', reportController.getRevenueToday)
    .get('/revenue', reportController.getRevenue)
    .get('/revenue/cash', reportController.getCashRevenue)
    .get('/revenue/non-cash', reportController.getNonCashRevenue)
    .get('/summary', reportController.getSummaryReport)
    //Product Reports
    .get('/top-products', reportController.getTopProducts)
    .get('/product-summary', reportController.getProductSummaryReport)
    .get("/best-seller", reportController.getBestSellerReport)
    .get("/slow-moving", reportController.getSlowMovingReport)
    .get("/top-products-by-revenue", reportController.getTopProductsByRevenue)
    //Inventory Reports
    .get("/lowest-stock", reportController.getLowestStockProducts);

module.exports = router;
