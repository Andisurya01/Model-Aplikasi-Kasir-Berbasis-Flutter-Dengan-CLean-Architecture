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