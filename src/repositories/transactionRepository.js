const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createTransaction = async (data) => {
    return prisma.transaction.create({
        data,
        include: {
            items: { include: { product: true } },
            payment: true,
            user: true,
        },
    });
};

exports.updatePaymentAndTransaction = async (orderId, status, rawNotification) => {
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
            data: { status },
        });

        return updatedPayment;
    } catch (error) {
        throw new Error("Repository: Failed to update payment & transaction -> " + error.message);
    }
};

exports.updatePaymentStatus = async (orderId, status) => {
    return prisma.payment.update({
        where: { midtransOrderId: orderId },
        data: { transactionStatus: status },
        include: { transaction: true },
    });
};

exports.findTransactionById = async (id) => {
    return prisma.transaction.findUnique({
        where: { id },
        include: {
            items: { include: { product: true } },
            payment: true,
            user: true,
        },
    });
};

exports.findAllTransactions = async () => {
    return prisma.transaction.findMany({
        include: {
            items: { include: { product: true } },
            payment: true,
            user: true,
        },
    });
};