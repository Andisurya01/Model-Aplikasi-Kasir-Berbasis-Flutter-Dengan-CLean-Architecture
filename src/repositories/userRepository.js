const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.findAllUsers = async () => await prisma.user.findMany({});

exports.findUserById = async (id) => await prisma.user.findUnique({
    where: { id },
});

exports.createUser = async (data) => await prisma.user.create({
    data: data,
});

exports.resetPassword = async (id, newPassword) => {
    try {
        return await prisma.user.update({
            where: { id },
            data: { password: newPassword },
        });
    } catch (error) {
        throw new Error("Error resetting password at Repository: " + error.message);
    }
}

exports.updateUser = async (id, data) => await prisma.user.update({
    where: { id },
    data: { ...data },
});

exports.activateNonActivateUser = async (id, isActive) => await prisma.user.update({
    where: { id },
    data: { isActive },
});

exports.deleteUser = async (id) => await prisma.user.delete({
    where: { id },
});

exports.findUserByEmail = async (email) => await prisma.user.findUnique({
    where: { email },
});

exports.findUserByName = async (name) => await prisma.user.findUnique({
    where: { name },
});