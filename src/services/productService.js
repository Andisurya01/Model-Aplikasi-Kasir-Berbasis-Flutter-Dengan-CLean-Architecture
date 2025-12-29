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
        const data = await productRepository.findProductById(id);
        console.log(data);

        return data
    } catch (error) {
        throw new Error("Error fetching product by ID at Service: " + error.message);
    }
}

exports.findProductsByCategoryAndSearch = async (categoryId, search) => {
    try {
        return await productRepository.findByCategoryIdAndSearch(categoryId, search);
    } catch (error) {
        throw new Error("Error fetching products by category and search at Service: " + error.message);
    }
}

exports.findProductsByCategoryAndSearchForInventory = async (categoryId, search) => {
    try {
        return await productRepository.findByCategoryIdAndSearchForInventory(categoryId, search);
    } catch (error) {
        throw new Error("Error fetching products by category and search at Service: " + error.message);
    }
}

exports.createProduct = async (data) => {
    try {
        const { name, description, price, image, stock, categoryId } = data;
        console.log(image);
        
        const final = await productRepository.createProduct({
           name,
           description,
           price: parseFloat(price),
           image : `uploads/${image}`,
           stock: parseInt(stock),
           categoryId
       });
       global.io.emit("product data posted", final);
        return final
    } catch (error) {
        throw new Error("Error creating product at Service: " + error.message);
    }
}

exports.addStock = async (id, quantity) => {
    try {
        const response = await productRepository.addStock(id, quantity);
        global.io.emit("product stock added", response);
        return response;
    } catch (error) {
        throw new Error("Error adding stock at Service: " + error.message);
    }
};

exports.updateProduct = async (id, data, file) => {
    try {
        console.log(data);

        const existingProduct = await productRepository.findProductById(id);
        if (!existingProduct) throw new Error("Product not found");

        let newImagePath = existingProduct.image;

        if (file) {
            newImagePath = `uploads/${file.filename}`;

            const oldImagePath = path.resolve(process.cwd(), existingProduct.image);

            if (existingProduct.image && fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }

        }
        console.log(data.price);

        newPrice = data.price || existingProduct.price

        const updatedData = {
            name: data.name && data.name.trim() !== "" ? data.name : existingProduct.name,
            description: data.description && data.description.trim() !== "" ? data.description : existingProduct.description,
            categoryId: data.categoryId || existingProduct.categoryId,
            image: newImagePath,
            price: parseFloat(newPrice),
        };
        console.log(updatedData);

        const final = await productRepository.updateProduct(id, updatedData);
        global.io.emit("product data updated", final);
        return final;
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
        global.io.emit("product status changed", updatedProduct);
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