const express = require('express');
const {
    addUsers,
    getUsers,
    deleteUser,
    userById,
    updateUser
} = require('../controllers/adminusers');

const AdminUsers = require('../models/AdminUser');
const router = express.Router();

const advancedResults = require('../middleware/advancedResults');

router
    .route('/')
    .post(addUsers)
    .get(advancedResults(AdminUsers), getUsers)
    .put(updateUser)

router
    .route('/:id')
    .delete(deleteUser)
    .get(userById)

module.exports = router;