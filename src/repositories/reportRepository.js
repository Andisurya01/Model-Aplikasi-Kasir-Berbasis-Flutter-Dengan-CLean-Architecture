const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getTopProducts = async ({ startDate, endDate, take, orderBy }) => {
    return await prisma.transactionItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true },
        where: {
            transaction: {
                status: 'PAID',
                ...(startDate && endDate && {
                    createdAt: {
                        gte: new Date(startDate),
                        lte: new Date(endDate),
                    }
                }),
            },
        },
        orderBy: {
            _sum: { quantity: orderBy || 'desc' },
        },
        take: take ? Number(take) : 10,
    });
};
