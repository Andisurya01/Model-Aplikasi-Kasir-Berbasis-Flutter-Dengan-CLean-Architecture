const categoryRepository = require('../repositories/categoryRepository');

exports.findAllCategories = async () => {
    try {
        return await categoryRepository.findAllCategories();
    } catch (error) {
        throw new Error('Error fetching categories at Service: ' + error.message);
    }
}

exports.findCategoryById = async (id) => {
    try {
        return await categoryRepository.findCategoryById(id);
    } catch (error) {
        throw new Error('Error fetching category at Service: ' + error.message);
    }
}

exports.createCategory = async (data) => {
    try {
        return await categoryRepository.createCategory(data);
    } catch (error) {
        throw new Error('Error creating category at Service: ' + error.message);
    }
}

exports.updateCategory = async (id, data) => {
    try {
        return await categoryRepository.updateCategory(id, data);
    } catch (error) {
        throw new Error('Error updating category at Service: ' + error.message);
    }
}

exports.deleteCategory = async (id) => {
    try {
        return await categoryRepository.deleteCategory(id);
    } catch (error) {
        throw new Error('Error deleting category at Service: ' + error.message);
    }
}
