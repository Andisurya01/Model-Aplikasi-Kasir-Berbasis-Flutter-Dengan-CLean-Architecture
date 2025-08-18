const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

exports.findAllPayments = async () => {
    return await prisma.payment.findMany();
};

exports.findPaymentById = async (id) => {
    return await prisma.payment.findUnique({
        where: { id: id },
    });
};

exports.createPayment = async (data) => {
    return await prisma.payment.create({
        data: data,
    });
};

exports.updatePayment = async (id, data) => {
    return await prisma.payment.update({
        where: { id: id },
        data: data,
    });
};
