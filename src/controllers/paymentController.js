const paymentService = require('../services/paymentService');

exports.findAllPayments = async (req, res) => {
    try {
        const payments = await paymentService.findAllPayments();
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.findPaymentById = async (req, res) => {
    const { id } = req.params;
    try {
        const payment = await paymentService.findPaymentById(id);
        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }
        res.json(payment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createPayment = async (req, res) => {
    const paymentData = req.body;
    try {
        const newPayment = await paymentService.createPayment(paymentData);
        res.status(201).json(newPayment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updatePayment = async (req, res) => {
    const { id } = req.params;
    const paymentData = req.body;
    try {
        const updatedPayment = await paymentService.updatePayment(id, paymentData);
        if (!updatedPayment) {
            return res.status(404).json({ message: "Payment not found" });
        }
        res.json(updatedPayment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};