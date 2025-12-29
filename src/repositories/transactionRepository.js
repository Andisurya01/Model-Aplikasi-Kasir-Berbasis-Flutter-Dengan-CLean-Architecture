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

exports.findAllTransactions = async (startDate, endDate, limit, skip) => {
    return prisma.transaction.findMany({
        include: {
            items: { include: { product: true } },
            payment: true,
            user: true,
        },
        where: {
            createdAt: {
                gte: startDate,
                lte: endDate,
            },
        },
        take: limit,
        skip: skip,
    });
};

exports.findPendingTransactions = async (startDate, endDate, limit, skip) => {
    const response = await prisma.transaction.findMany({
        include: {
            items: { include: { product: true } },
            payment: true,
            user: true,
        },
        where: {
            createdAt: {
                gte: startDate,
                lte: endDate,
            },
            status: "PENDING",
        },
        orderBy: { createdAt: 'desc' },
        ...(limit && { take: limit }),
        ...(skip && { skip: skip }),
    });

    return response;
};

exports.findTransactionsWithFilters = async ({ status, paymentType, startDate, endDate, limit, skip }) => {
  const where = {};

  if (status) where.status = status;
  if (paymentType) where.payment = { paymentType };
  if (startDate && endDate)
    where.createdAt = { gte: new Date(startDate), lte: new Date(endDate) };

  const [total, data] = await Promise.all([
    prisma.transaction.count({ where }),
    prisma.transaction.findMany({
      where,
      include: {
        items: { include: { product: true } },
        payment: true,
        user: true,
      },
      orderBy: { createdAt: 'desc' },
      take: Number(limit) || 10,
      skip: Number(skip) || 0,
    }),
  ]);

  return { total, data };
};