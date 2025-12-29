const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.findAllProducts = async () => await prisma.product.findMany({
  include: { category: true }
});

exports.findProductById = async (id) => await prisma.product.findUnique({
  where: { id }, include: { category: true }
});

exports.findDetailProductById = async (id) => await prisma.product.findFirst({
  where: { id },
  include: { category: true }
})

exports.findByCategoryIdAndSearch = async (categoryId, search) => await prisma.product.findMany({
  where: {
    AND: [
      categoryId ? { categoryId } : {},

      search
        ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }
        : {},
    ],
    isActive: true
  },
  include: { category: true }
});

exports.findByCategoryIdAndSearchForInventory = async (categoryId, search) => await prisma.product.findMany({
  where: {
    AND: [
      categoryId ? { categoryId } : {},
      search
        ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }
        : {},
    ]
  },
  include: { category: true }
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

exports.addStock = async (id, quantity) => {
  return await prisma.product.update({
    where: { id },
    data: {
      stock: {
        increment: quantity
      }
    }
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