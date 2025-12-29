const categoryService = require('../services/categoryService');

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await categoryService.findAllCategories();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getCategoryById = async (req, res) => {
    const { id } = req.params;
    try {
        const category = await categoryService.findCategoryById(id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.createCategory = async (req, res) => {
    const body = req.body;
    try {
        const newCategory = await categoryService.createCategory(body);
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.updateCategory = async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    try {
        const updatedCategory = await categoryService.updateCategory(id, body);
        if (!updatedCategory) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.status(201).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedCategory = await categoryService.deleteCategory(id);
        if (!deletedCategory) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}