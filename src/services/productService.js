const productRepository = require("../repositories/productRepository");

exports.findAllProducts = async () => {
    try {
        return await productRepository.findAllProducts();
    } catch (error) {
        throw new Error("Error fetching products at Service: " + error.message);
    }
}

exports.findProductById = async (id) => {
    try {
        return await productRepository.findProductById(id);
    } catch (error) {
        throw new Error("Error fetching product by ID at Service: " + error.message);
    }
}

exports.createProduct = async (data) => {
    try {
        const { name, description, price, image, stock, categoryId } = data;
        return await productRepository.createProduct({
            name,
            description,
            price : parseFloat(price),
            image,
            stock : parseInt(stock),
            categoryId
        });
    } catch (error) {
        throw new Error("Error creating product at Service: " + error.message);
    }
}

exports.updateProduct = async (id, data) => {
    try {
        return await productRepository.updateProduct(id, data);
    } catch (error) {
        throw new Error("Error updating product at Service: " + error.message);
    }
}

exports.deleteProduct = async (id) => {
    try {
        return await productRepository.deleteProduct(id);
    } catch (error) {
        throw new Error("Error deleting product at Service: " + error.message);
    }
}