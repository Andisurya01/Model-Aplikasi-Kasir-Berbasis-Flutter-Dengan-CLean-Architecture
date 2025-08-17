const productService = require('../services/productService');

exports.getAllProducts = async (req, res) => {
    try {
        const products = await productService.findAllProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await productService.findProductById(id);
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.createProduct = async (req, res) => {    
    const productData = req.body;
    if (req.file) {
        productData.image = req.file.filename;
    }
    try {
        const newProduct = await productService.createProduct(productData);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const productData = req.body;
    try {
        const updatedProduct = await productService.updateProduct(id, productData);
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        await productService.deleteProduct(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
