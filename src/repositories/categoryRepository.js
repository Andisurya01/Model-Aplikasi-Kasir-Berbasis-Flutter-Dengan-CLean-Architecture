const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.findAllCategories = async () => {
    return await prisma.category.findMany();
}

exports.findCategoryById = async (id) => {
    return await prisma.category.findUnique({
        where: { id: id }
    });
}

exports.createCategory = async (data) => {
    return await prisma.category.create({
        data
    });
}

exports.updateCategory = async (id, data) => {
    return await prisma.category.update({
        where: { id: id },
        data
    });
}

exports.deleteCategory = async (id) => {
    return await prisma.category.delete({
        where: { id: id }
    });
}