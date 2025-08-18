const reportService = require('../services/reportService');

exports.getTopProducts = async (req, res) => {
  try {
    const { startDate, endDate, take, orderBy } = req.query;

    const topProducts = await reportService.getTopProducts({
      startDate,
      endDate,
      take,
      orderBy,
    });

    res.json(topProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
