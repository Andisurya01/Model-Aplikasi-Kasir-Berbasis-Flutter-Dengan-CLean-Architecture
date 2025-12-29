const transactionService = require('../services/transactionService');

exports.createCashTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const transaction = await transactionService.createCashTransaction(req.body, userId);
    console.log("berhasil nih");
    
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createMidtransTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const transaction = await transactionService.createMidtransTransaction(req.body, userId);
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.midtransSuccess = async (req, res) => {
  console.log(req.body);
  global.io.emit("transaction:update", { orderId: req.body.order_id, status: "SUCCESS" });
  res.send("Pembayaran berhasil, silakan kembali ke aplikasi 👌");
};

exports.midtransFailed = async (req, res) => {
  global.io.emit("transaction:update", { orderId: req.body.order_id, status: "FAILED" });
  res.send("Pembayaran gagal, coba lagi 😔");
};

exports.midtransPending = async (req, res) => {
  global.io.emit("transaction:update", { orderId: req.body.order_id, status: "PENDING" });
  res.send("Pembayaran masih pending, silakan cek nanti ⏳");
};

exports.updateTransactionStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const updated = await transactionService.updateTransactionStatus(orderId, status);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await transactionService.findTransactionById(id);
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllTransactions = async (req, res) => {
  try {
    const { startDate, endDate, limit, skip } = req.query;
    const transactions = await transactionService.findAllTransactions(startDate, endDate, limit, skip);
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPendingTransactions = async (req, res) => {
  try {
    const { startDate, endDate, limit, skip } = req.query;
    const transactions = await transactionService.findPendingTransactions(startDate, endDate, limit, skip);
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTransactionsWithFilters = async (req, res) => {
  try {
    const { status, paymentType, startDate, endDate, limit, skip } = req.query;
    console.log(req.query);

    const result = await transactionService.getTransactionsWithFilters({
      status,
      paymentType,
      startDate,
      endDate,
      limit,
      skip,
    });

    res.json({
      filters: { status, paymentType, startDate, endDate },
      pagination: { limit: Number(limit) || 10, skip: Number(skip) || 0, total: result.total },
      data: result.data,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
