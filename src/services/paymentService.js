const paymentRepository = require('../repositories/paymentRepository');

exports.findAllPayments = async () => {
    try {
        return await paymentRepository.findAllPayments();
    } catch (error) {
        throw new Error("Error fetching payments at Service : " + error.message);
    }
};

exports.findPaymentById = async (id) => {
    try {
        return await paymentRepository.findPaymentById(id);
    } catch (error) {
        throw new Error("Error fetching payment at Service : " + error.message);
    }
};

exports.createPayment = async (data) => {
    try {
        return await paymentRepository.createPayment(data);
    } catch (error) {
        throw new Error("Error creating payment at Service : " + error.message);
    }
};

exports.updatePayment = async (id, data) => {
    try {
        return await paymentRepository.updatePayment(id, data);
    } catch (error) {
        throw new Error("Error updating payment at Service : " + error.message);
    }
};