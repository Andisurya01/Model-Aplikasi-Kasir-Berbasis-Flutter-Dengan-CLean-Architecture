const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middleware/upload');

router
    .get('/', productController.getAllProducts)
    .get('/:id', productController.getProductById)
    .post('/', upload.single('image'), productController.createProduct)
    .put('/:id', upload.single('image'), productController.updateProduct)
    .delete('/:id', productController.deleteProduct);

module.exports = router;