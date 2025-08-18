const productRepository = require("../repositories/productRepository");
const fs = require("fs");
const path = require("path");

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
            price: parseFloat(price),
            image,
            stock: parseInt(stock),
            categoryId
        });
    } catch (error) {
        throw new Error("Error creating product at Service: " + error.message);
    }
}

exports.updateProduct = async (id, data, file) => {
    try {
        const existingProduct = await productRepository.findProductById(id);
        if (!existingProduct) throw new Error("Product not found");

        let newImagePath = existingProduct.image;

        if (file) {
            newImagePath = `uploads/${file.filename}`;

            const oldImagePath = path.resolve(process.cwd(),  existingProduct.image);

            if (existingProduct.image && fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }

        }

        const updatedData = {
            name: data.name && data.name.trim() !== "" ? data.name : existingProduct.name,
            description: data.description && data.description.trim() !== "" ? data.description : existingProduct.description,
            categoryId: data.categoryId || existingProduct.categoryId,
            image: newImagePath,
            price: typeof data.price === "number" ? data.price : existingProduct.price,
            stock: typeof data.stock === "number" ? data.stock : existingProduct.stock,
        };

        return await productRepository.updateProduct(id, updatedData);
    } catch (error) {
        throw new Error("Error updating product at Service: " + error.message);
    }
};

exports.activateNonActivateProduct = async (id) => {
    try {
        const product = await productRepository.findProductById(id);
        if (!product) {
            throw new Error("Product not found");
        }

        const isActive = !product.isActive;
        const updatedProduct = await productRepository.activateNonActivateProduct(id, isActive);
        return updatedProduct;
    } catch (error) {
        throw new Error("Error activating/deactivating product at Service: " + error.message);
    }
}

exports.deleteProduct = async (id) => {
    try {
        return await productRepository.deleteProduct(id);
    } catch (error) {
        throw new Error("Error deleting product at Service: " + error.message);
    }
}