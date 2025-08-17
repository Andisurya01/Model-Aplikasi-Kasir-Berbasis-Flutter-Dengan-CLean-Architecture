const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.findAllProducts = async () => await prisma.product.findMany({});

exports.findProductById = async (id) => await prisma.product.findUnique({
    where: { id },
});

exports.createProduct = async (data) => await prisma.product.create({ data });

exports.updateProduct = async (id, data) => await prisma.product.update({
    where: { id },
    data
});

exports.deleteProduct = async (id) => await prisma.product.delete({
    where: { id }
});