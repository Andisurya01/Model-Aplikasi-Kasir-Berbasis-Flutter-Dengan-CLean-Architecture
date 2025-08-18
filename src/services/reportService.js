const reportRepository = require('../repositories/reportRepository');
const productRepository = require('../repositories/productRepository');

exports.getTopProducts = async (filters) => {
  try {
    // step 1: ambil hasil groupBy
    const result = await reportRepository.getTopProducts(filters);
    const productIds = result.map(item => item.productId);

    // step 2: ambil semua produk sekali saja
    const products = await productRepository.findProductsByIds(productIds);

    // step 3: gabungkan data
    const enriched = result.map(item => {
      const product = products.find(p => p.id === item.productId);
      return {
        ...item,
        product: product || null,
      };
    });

    return enriched;
  } catch (error) {
    throw new Error("Error fetching top products at Service: " + error.message);
  }
};