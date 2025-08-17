const transactionService = require('../services/transactionService');

exports.createCashTransaction = async (req, res) => {
  try {
    const transaction = await transactionService.createCashTransaction(req.body);
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createMidtransTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId);

    const transaction = await transactionService.createMidtransTransaction(req.body, userId);
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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
    const transactions = await transactionService.findAllTransactions();
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};