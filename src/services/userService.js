const userRepository = require("../repositories/userRepository");
const authService = require("./authService");
const  ApplicationError = require("../../config/errors/ApplicationError");
exports.findAllUsers = async () => {
    try {
        return await userRepository.findAllUsers();
    } catch (error) {
        throw new Error("Error fetching users at Service: " + error.message);
    }
}

exports.findUserById = async (id) => {
    try {
        return await userRepository.findUserById(id);
    } catch (error) {
        throw new Error("Error fetching user by ID at Service: " + error.message);
    }
}

exports.createUser = async (data) => {
    try {
        const { name, email, password, role } = data;
        const encryptedPassword = await authService.encryptedPassword(password);

        const user = await userRepository.createUser({
            name,
            email,
            password: encryptedPassword,
            role,
        })
        console.log(user);

        return user;
    } catch (error) {
        throw new Error("Error creating user at Service: " + error.message);
    }
}

exports.resetPassword = async (email, password) => {
    try {
        console.log(email, password);
        const user = await userRepository.findUserByEmail(email);
        if (!user) {
            throw new ApplicationError("User not found", 404);
        }
        const newPassword = await authService.encryptedPassword(password);
        return await userRepository.resetPassword(user.id, newPassword);
    } catch (error) {
        throw new Error("Error resetting password at Service: " + error.message);
    }
}

exports.updateUser = async (id, data) => {
    try {
        return await userRepository.updateUser(id, data);
    } catch (error) {
        throw new Error("Error updating user at Service: " + error.message);
    }
}

exports.activateNonActivateUser = async (id) => {
    try {
        const user = await userRepository.findUserById(id);
        if (!user) {
            throw new ApplicationError("User not found", 404);
        }
        const isActive = !user.isActive;
        const updatedUser = await userRepository.activateNonActivateUser(id, isActive);
        return updatedUser;
    } catch (error) {
        throw new Error("Error activating/deactivating user at Service: " + error.message);
    }
}

exports.deleteUser = async (id) => {
    try {
        return await userRepository.deleteUser(id);
    } catch (error) {
        throw new Error("Error deleting user at Service: " + error.message);
    }
}

exports.findUserByEmail = async (email) => {
    try {
        const user = await userRepository.findUserByEmail(email);

        if (!user) {
            throw new ApplicationError("User not found", 404);
        }
        return user;
    } catch (err) {
        throw new ApplicationError("service : " + err.message, err.statusCode || 500);
    }
}

exports.findUserByName = async (name) => {
    try {
        return await userRepository.findUserByName(name);
    } catch (error) {
        throw new Error("Error fetching user by name at Service: " + error.message);
    }
}