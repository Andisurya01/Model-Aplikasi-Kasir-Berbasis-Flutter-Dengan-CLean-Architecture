const transactionRepository = require('../repositories/transactionRepository');
const productRepository = require('../repositories/productRepository')
const snap = require('../utils/midtrans');
const { normalizeDateRange } = require('../utils/normalizeDate');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createCashTransaction = async (data, userId) => {
    try {

        const total = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const change = data.amountPaid - total;

        if (data.amountPaid < total || data.amountPaid == null) {
            throw new Error("Amount paid is less than total transaction amount")
        }

        for (const item of data.items) {
            console.log(item);

            const checking = await productRepository.findProductById(item.productId)
            if (checking.stock == 0) {
                throw new Error(checking.name + " out off stock")
            } if (checking.stock < item.quantity) {
                throw new Error("Only " + checking.stock + " " + checking.name + " products left")
            }

            const updateStock = {
                stock: checking.stock - item.quantity
            };
            await productRepository.updateProduct(
                item.productId,
                updateStock
            )
        }

        const orderId = `ORDER-${Date.now()}`;

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
                    change: change,
                    orderId: orderId
                },
            },
        };

        const savedTransaction = await transactionRepository.createTransaction(transactionData);

        global.io.emit("transaction cash:created", savedTransaction)
        return savedTransaction;
    } catch (error) {
        throw new Error(error.message);
    }
};

exports.createMidtransTransaction = async (data, userId) => {
    try {
        const total = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const orderId = `ORDER-${Date.now()}`;

        for (const item of data.items) {
            const checking = await productRepository.findProductById(item.productId)

            if (checking.stock == 0) {
                throw new Error(checking.name + " out off stock")
            } if (checking.stock < item.quantity) {
                throw new Error("Only " + checking.stock + " " + checking.name + " products left")
            }

            const updateStock = {
                stock: checking.stock - item.quantity
            };
            await productRepository.updateProduct(
                item.productId,
                updateStock
            )
        }

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
            callbacks: {
                finish: "https://localhost:3000/api/transactions/midtrans/payment/success",
                error: "https://localhost:3000/api/transactions/midtrans/payment/failed",
                pending: "https://localhost:3000/api/transactions/midtrans/payment/pending",
            }
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
                    midtransOrderId: orderId,
                    fraudStatus: snapResponse.fraud_status,
                    rawResponse: snapResponse ?? {},
                    orderId: orderId
                },
            },
        };

        const savedTransaction = await transactionRepository.createTransaction(transactionData);
        global.io.emit("transaction:create", savedTransaction);
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
        console.log("Updating transaction status:", orderId, status);
        const response = await transactionRepository.updatePaymentAndTransaction(
            orderId,
            status,
            rawNotification
        );
        console.log("Transaction status updated:", response.rawResponse.status_code);
        if (response.rawResponse.status_code === "200") {
            global.io.emit("transaction:update", { orderId });
            console.log("Transaction status updated successfully");
        }
        return response;
    } catch (error) {
        throw new Error("Service: Failed to update transaction status -> " + error.message);
    }
};


exports.findTransactionById = async (id) => {
    try {
        global.io.emit("transaction:find", { id });
        return await transactionRepository.findTransactionById(id);
    } catch (error) {
        throw new Error("Failed to find transaction by ID at Service: " + error.message);
    }
};

exports.findAllTransactions = async (startDate, endDate, limit, skip) => {
    try {
        const { start, end } = normalizeDateRange(startDate, endDate);
        console.log({ start, end, limit, skip });

        return await transactionRepository.findAllTransactions(start, end, Number(limit), Number(skip));
    } catch (error) {
        throw new Error("Failed to find all transactions at Service: " + error.message);
    }
};

exports.findPendingTransactions = async (startDate, endDate, limit, skip) => {
    try {
        const { start, end } = normalizeDateRange(startDate, endDate);
        const total = await prisma.transaction.count({
            where: {
                createdAt: {
                    gte: start,
                    lte: end,
                },
                status: "PENDING",
            },
        });
        const response = await transactionRepository.findPendingTransactions(start, end, Number(limit), Number(skip));
        return { total: total, data: response };
    } catch (error) {
        throw new Error("Failed to find pending transactions at Service: " + error.message);
    }
};

exports.getTransactionsWithFilters = async (filters) => {
    try {
        const { startDate, endDate, status, paymentType, limit, skip } = filters;

        // Normalisasi tanggal
        const { start, end } = normalizeDateRange(startDate, endDate);

        return await transactionRepository.findTransactionsWithFilters({
            status,
            paymentType,
            startDate: start,
            endDate: end,
            limit,
            skip,
        });
    } catch (error) {
        throw new Error("Failed to fetch transactions: " + error.message);
    }
};
