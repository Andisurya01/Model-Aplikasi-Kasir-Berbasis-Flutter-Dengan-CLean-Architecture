const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Ambil data transaksi (aggregate atau list)
 */
exports.getTransactions = async ({ start, end, mode = "aggregate", limit, skip }) => {
  if (mode === "aggregate") {
    return prisma.transaction.aggregate({
      _sum: { total: true },
      where: {
        status: 'PAID',
        createdAt: { gte: start, lte: end },
      },
    });
  }

  if (mode === "list") {
    const request = {
      where: { status: 'PAID', createdAt: { gte: start, lte: end } },
      orderBy: { createdAt: 'asc' },
      // skip: 1,
      // take: 1000, // default limit
    }
    // if (limit) {
    //   request.take = limit;
    // }
    // if (skip) {
    //   request.skip = skip;
    // }


    return prisma.transaction.findMany(request);

  }
};

/**
 * Ambil revenue berdasarkan tipe pembayaran
 */
exports.getRevenueByPaymentType = async ({ paymentType, start, end }) => {
  return prisma.payment.aggregate({
    _sum: { grossAmount: true },
    where: {
      paymentType,
      transaction: { status: "PAID" },
      createdAt: { gte: start, lte: end },
    },
  });
};

/**
 * Ambil data penjualan produk
 */
exports.getProductSales = async ({ start, end, limit }) => {
  const options = {
    where: {
      transaction: {
        status: 'PAID',
        createdAt: { gte: start, lte: end },
      },
    },
    include: { product: true },
  };

  return prisma.transactionItem.findMany(options);
};

/**
 * Ambil produk paling laku (by quantity atau revenue)
 */
exports.getTopProducts = async ({ start, end, orderBy = "quantity", limit }) => {
  return prisma.transactionItem.groupBy({
    by: ["productId"],
    _sum: {
      quantity: true,
      price: true,
      discount: true,
    },
    where: {
      transaction: {
        status: "PAID",
        createdAt: { gte: start, lte: end },
      },
    },
    orderBy: { _sum: { [orderBy]: "desc" } },
    take: limit,
  });
};

/**
 * Ambil produk dengan revenue tertinggi
 */
exports.getTopProductsByRevenue = async ({ start, end, limit, skip }) => {
  return prisma.transactionItem.groupBy({
    by: ["productId"],
    _sum: {
      quantity: true,
      price: true,
      discount: true,
    },
    where: {
      transaction: {
        status: "PAID",
        createdAt: { gte: start, lte: end },
      },
    },
    // include: { category: true },
    orderBy: { _sum: { price: "desc" } },
    take: limit,
    skip: skip,
  });
};

/**
 * Ambil semua produk
 */
exports.getAllProducts = async () => {
  return prisma.product.findMany(
    {
      include: { category: true }
    }
  );
};

/**
 * Ambil produk dengan stok terendah
 */
exports.getProductsByLowestStock = async (limit) => {
  return prisma.product.findMany({
    orderBy: { stock: "asc" },
    take: limit,
    select: {
      id: true,
      name: true,
      stock: true,
      price: true,
      isActive: true,
    },
  });
};
