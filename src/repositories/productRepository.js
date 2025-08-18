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

exports.activateNonActivateProduct = async (id, isActive) => {
    return await prisma.product.update({
        where: { id },
        data: { isActive }
    });
};

exports.findProductsByIds = async (ids) => {
  return await prisma.product.findMany({
    where: { id: { in: ids } },
    select: {
      id: true,
      name: true,
      price: true,
      image: true,
      category: {
        select: { id: true, name: true }
      }
    }
  });
};