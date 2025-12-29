const reportService = require('../services/reportService');

exports.getTopProducts = async (req, res) => {
  try {
    const { startDate, endDate, limit, orderBy } = req.query;
    console.log(req.query);
    
    const topProducts = await reportService.getTopProducts({
      startDate,
      endDate,
      limit: Number(limit) || 10,
      orderBy,
    });
    console.log(topProducts);
    
    res.json(topProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRevenueToday = async (req, res) => {
  try {
    const revenue = await reportService.getRevenueToday();
    res.json(revenue);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRevenue = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const revenue = await reportService.getRevenue(startDate, endDate);
    res.json(revenue);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSummaryReport = async (req, res) => {
  try {
    const { startDate, endDate, limit, skip } = req.query;
    const summary = await reportService.getSummaryReport(startDate, endDate, Number(limit), Number(skip));
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCashRevenue = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const revenue = await reportService.getRevenueByPayment("CASH", startDate, endDate);
    res.json(revenue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getNonCashRevenue = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const revenue = await reportService.getRevenueByPayment("MIDTRANS", startDate, endDate);
    res.json(revenue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductSummaryReport = async (req, res) => {
  try {
    const { startDate, endDate, limit } = req.query;
    const summary = await reportService.getProductSummaryReport(startDate, endDate, Number(limit));
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBestSellerReport = async (req, res) => {
  try {
    const { startDate, endDate, limit } = req.query;
    const report = await reportService.getBestSellerReport(startDate, endDate, Number(limit));
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSlowMovingReport = async (req, res) => {
  try {
    const { startDate, endDate, limit } = req.query;
    const report = await reportService.getSlowMovingReport(startDate, endDate, Number(limit));
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTopProductsByRevenue = async (req, res) => {
  try {
    const { startDate, endDate, limit, skip } = req.query;
    console.log(req.query);
    const result = await reportService.getTopProductsByRevenue(startDate, endDate, Number(limit), Number(skip) || 0);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLowestStockProducts = async (req, res) => {
  try {
    const { limit } = req.query;
    const data = await reportService.getLowestStockProducts(Number(limit) || 10);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
