const userRepository = require("../repositories/userRepository");
const authService = require("./authService");
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

exports.updateUser = async (id, data) => {
    try {
        return await userRepository.updateUser(id, data);
    } catch (error) {
        throw new Error("Error updating user at Service: " + error.message);
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
        return await userRepository.findUserByEmail(email);
    } catch (error) {
        throw new Error("Error fetching user by email at Service: " + error.message);
    }
}

exports.findUserByName = async (name) => {
    try {
        return await userRepository.findUserByName(name);
    } catch (error) {
        throw new Error("Error fetching user by name at Service: " + error.message);
    }
}