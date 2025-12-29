const express = require('express');
const router = express.Router();
const { userPasswordSchema } = require('../middleware/schemaInputValidators/userPasswordSchema');
const userController = require('../controllers/userController');
const validate = require('../middleware/inputValidator');

router
    .get('/', userController.getAllUsers)
    .get('/:id', userController.getUserById)
    .get('/email/:email', userController.getUserByEmail)
    .post('/change_status/:id', userController.activateNonActivateUser)
    .post('/reset_password', validate(userPasswordSchema), userController.resetPassword)
    .put('/:id', userController.updateUser)
    .post('/', userController.createUser)
    .delete('/:id', userController.deleteUser);

module.exports = router;