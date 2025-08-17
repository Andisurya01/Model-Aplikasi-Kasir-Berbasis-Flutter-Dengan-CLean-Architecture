const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router
    .get('/', userController.getAllUsers)
    .get('/:id', userController.getUserById)
    .put('/:id', userController.updateUser)
    .post('/', userController.createUser)
    .delete('/:id', userController.deleteUser);

module.exports = router;