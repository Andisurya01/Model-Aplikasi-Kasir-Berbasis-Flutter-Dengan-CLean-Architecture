const transactionRepository = require('../repositories/transactionRepository');
const snap = require('../utils/midtrans');
exports.createCashTransaction = async (data, userId) => {
    try {
        const total = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const change = data.amountPaid - total;
        const orderId = `ORDER-${Date.now()}`;

        const parameter = {
            transaction_details: {
                order_id: orderId,
                gross_amount: total,
            },
            customer_details: {
                user_id: userId,
            },
            item_details: data.items.map((item) => ({
                id: item.productId,
                price: item.price,
                quantity: item.quantity,
                name: item.productName ?? "Product",
            })),
        };

        const snapResponse = await snap.createTransaction(parameter);

        const transactionData = {
            userId: userId,
            total,
            discount: data.discount ?? 0,
            status: "PAID",
            items: {
                create: data.items.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price,
                })),
            },
            payment: {
                create: {
                    paymentType: "CASH",
                    grossAmount: total,
                    transactionStatus: "PAID",
                    amountPaid: data.amountPaid,
                    change,
                },
            },
        };

        const savedTransaction = await transactionRepository.createTransaction(transactionData);

        return {
            transaction: savedTransaction,
            redirect_url: snapResponse.redirect_url,
        };
    } catch (error) {
        throw new Error("Failed to create cash transaction at Service: " + error.message);
    }
};

exports.createMidtransTransaction = async (data, userId) => {
    try {
        const total = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        // const change = data.amountPaid - total;
        const orderId = `ORDER-${Date.now()}`;

        const parameter = {
            transaction_details: {
                order_id: orderId,
                gross_amount: total,
            },
            customer_details: {
                user_id: userId,
            },
            item_details: data.items.map((item) => ({
                id: item.productId,
                price: item.price,
                quantity: item.quantity,
                name: item.productName ?? "Product",
            })),
        };

        const snapResponse = await snap.createTransaction(parameter);

        const transactionData = {
            userId: userId,
            total: total,
            discount: data.discount ?? 0,
            status: "PENDING",
            items: {
                create: data.items.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price,
                })),
            },
            payment: {
                create: {
                    paymentType: "MIDTRANS",
                    grossAmount: total,
                    transactionStatus: "PENDING",
                    midtransOrderId: snapResponse.order_id,
                    fraudStatus: snapResponse.fraud_status,
                    rawResponse: snapResponse ?? {},
                },
            },
        };

        const savedTransaction = await transactionRepository.createTransaction(transactionData);

        return {
            transaction: savedTransaction,
            redirect_url: snapResponse.redirect_url,
        };
    } catch (error) {
        throw new Error("Failed to create midtrans transaction at Service: " + error.message);
    }
};

exports.updateTransactionStatus = async (orderId, status, rawNotification) => {
    try {
        // update payment dulu
        const updatedPayment = await prisma.payment.update({
            where: { midtransOrderId: orderId },
            data: {
                transactionStatus: status,
                fraudStatus: rawNotification.fraud_status ?? null,
                rawResponse: rawNotification,
                amountPaid: rawNotification.gross_amount ? parseInt(rawNotification.gross_amount) : null,
            },
            include: { transaction: true },
        });

        // update juga tabel transaction biar konsisten
        await prisma.transaction.update({
            where: { id: updatedPayment.transactionId },
            data: {
                status: status,
            },
        });

        return updatedPayment;
    } catch (error) {
        throw new Error("Failed to update transaction status at Service: " + error.message);
    }
};


exports.findTransactionById = async (id) => {
    try {
        return await transactionRepository.findTransactionById(id);
    } catch (error) {
        throw new Error("Failed to find transaction by ID at Service: " + error.message);
    }
};

exports.findAllTransactions = async () => {
    try {
        return await transactionRepository.findAllTransactions();
    } catch (error) {
        throw new Error("Failed to find all transactions at Service: " + error.message);
    }
};