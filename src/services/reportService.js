const reportRepository = require('../repositories/reportRepository');
const productRepository = require('../repositories/productRepository');
const { normalizeDateRange } = require('../utils/normalizeDate');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getTopProducts = async ({ startDate, endDate, limit, orderBy }) => {
  console.log({ startDate, endDate, limit, orderBy });

  const { start, end } = normalizeDateRange(startDate, endDate);
  const result = await reportRepository.getTopProducts({ start, end, orderBy, limit });
  console.log(result);

  const productIds = result.map(item => item.productId);
  const products = await productRepository.findProductsByIds(productIds);

  return result.map(item => {
    const product = products.find(p => p.id === item.productId);
    console.log(product);
    return {
      product_id: item.productId,
      product_name: product?.name || "Unknown",
      total_qty_sold: item._sum.quantity || 0,
      total_revenue: (item._sum.price || 0) - (item._sum.discount || 0),
    };
  });
};

exports.getRevenueToday = async () => {
  const start = new Date(); start.setHours(0, 0, 0, 0);
  const end = new Date(); end.setHours(23, 59, 59, 999);
  return reportRepository.getTransactions({ start, end, mode: "aggregate" });
};

exports.getRevenue = async (startDate, endDate) => {
  const { start, end } = normalizeDateRange(startDate, endDate);
  return reportRepository.getTransactions({ start, end, mode: "aggregate" });
};

exports.getSummaryReport = async (startDate, endDate, limit, skip = 0) => {
  const { start, end } = normalizeDateRange(startDate, endDate);

  // Query data yang sudah digroup per hari
  const rows = await prisma.$queryRaw`
    SELECT 
      DATE("createdAt") AS date,
      COUNT(*)::int AS total_transactions,
      COALESCE(SUM("total"), 0)::bigint AS total_revenue,
      COALESCE(SUM("discount"), 0)::bigint AS total_discount,
      (COALESCE(SUM("total"), 0) - COALESCE(SUM("discount"), 0))::bigint AS net_sales
    FROM "Transaction"
    WHERE "status" = 'PAID' AND "createdAt" BETWEEN ${start} AND ${end}
    GROUP BY DATE("createdAt")
    ORDER BY DATE("createdAt") ASC
    LIMIT ${limit} OFFSET ${skip};
  `;


  const summary = rows.map(r => ({
    ...r,
    total_revenue: Number(r.total_revenue),
    total_discount: Number(r.total_discount),
    net_sales: Number(r.net_sales),
  }));
  console.log({ summary });

  return {
    period: `${start.toISOString().split("T")[0]} to ${end.toISOString().split("T")[0]}`,
    summary: summary
  };
};


exports.getRevenueByPayment = async (paymentType, startDate, endDate) => {
  const { start, end } = normalizeDateRange(startDate, endDate);
  const result = await reportRepository.getRevenueByPaymentType({ paymentType, start, end });

  return {
    paymentType,
    total_revenue: result._sum.grossAmount || 0,
  };
};

exports.getProductSummaryReport = async (startDate, endDate, limit) => {
  const { start, end } = normalizeDateRange(startDate, endDate);
  const items = await reportRepository.getProductSales({ start, end, limit });

  let totalProductsSold = 0;
  let totalRevenue = 0;
  const grouped = {};

  for (const item of items) {
    const pid = item.productId;
    if (!grouped[pid]) {
      grouped[pid] = {
        product_id: pid,
        product_name: item.product?.name || "Unknown",
        total_qty_sold: 0,
        total_revenue: 0,
      };
    }
    grouped[pid].total_qty_sold += item.quantity;
    grouped[pid].total_revenue += item.price * item.quantity - (item.discount || 0);

    totalProductsSold += item.quantity;
    totalRevenue += item.price * item.quantity - (item.discount || 0);
  }

  return {
    summary: {
      total_products_sold: totalProductsSold,
      total_revenue: totalRevenue,
    },
    products: Object.values(grouped),
  };
};

exports.getBestSellerReport = async (startDate, endDate, limit) => {
  const { start, end } = normalizeDateRange(startDate, endDate);
  const items = await reportRepository.getProductSales({ start, end, limit });

  const grouped = {};
  for (const item of items) {
    const pid = item.productId;
    if (!grouped[pid]) {
      grouped[pid] = { product_name: item.product?.name || "Unknown", total_qty_sold: 0 };
    }
    grouped[pid].total_qty_sold += item.quantity;
  }


  const sorted = Object.values(grouped).sort((a, b) => b.total_qty_sold - a.total_qty_sold);

  var count = limit;
  if (!limit) {
    count = items.length;
  }

  return {
    period: `${start.toISOString().split("T")[0]} to ${end.toISOString().split("T")[0]}`,
    best_seller: sorted.slice(0, count),
  };
};

exports.getSlowMovingReport = async (startDate, endDate, limit) => {
  const { start, end } = normalizeDateRange(startDate, endDate);
  const items = await reportRepository.getProductSales({ start, end });
  const allProducts = await reportRepository.getAllProducts();

  const grouped = {};
  for (const p of allProducts) {
    grouped[p.id] = { product_name: p.name, total_qty_sold: 0 };
  }

  for (const item of items) {
    grouped[item.productId].total_qty_sold += item.quantity;
  }

  const sorted = Object.values(grouped).sort((a, b) => a.total_qty_sold - b.total_qty_sold);
  var count = limit;
  if (!limit) {
    count = allProducts.length;
  }
  return {
    period: `${start.toISOString().split("T")[0]} to ${end.toISOString().split("T")[0]}`,
    slow_moving: sorted.slice(0, count),
  };
};

exports.getTopProductsByRevenue = async (startDate, endDate, limit, skip) => {
  const { start, end } = normalizeDateRange(startDate, endDate);
  const grouped = await reportRepository.getTopProductsByRevenue({ start, end, limit, skip });

  const products = await Promise.all(grouped.map(async (g) => {
    const product = await productRepository.findProductById(g.productId);
    const totalRevenue = (g._sum.price || 0) - (g._sum.discount || 0);

    return {
      product_id: product?.id,
      product_image: product?.image || "Unknown",
      product_category: product?.categoryId || "Unknown",
      product_name: product?.name || "Unknown",
      total_qty_sold: g._sum.quantity || 0,
      total_revenue: totalRevenue,
    };
  }));

  return {
    period: `${startDate} to ${endDate}`,
    products,
  };
};

exports.getLowestStockProducts = async () => {
  const products = await reportRepository.getProductsByLowestStock(limit);

  return {
    timestamp: new Date().toISOString(),
    products: products.map(p => ({
      product_id: p.id,
      product_name: p.name,
      stock: p.stock,
      price: p.price,
      is_active: p.isActive,
    })),
  };
};
