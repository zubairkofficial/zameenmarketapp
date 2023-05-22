const express = require('express');
const {
    adminLogin,
    getLoggedinUser,
    usersLogin,
    getMe
} = require('../controllers/auth');
const { protect } = require('../middleware/auth');

const AdminUsers = require('../models/AdminUser');
const router = express.Router();

const advancedResults = require('../middleware/advancedResults');

router
    .route('/admin')
    .post(adminLogin)
router
    .route('/admin/:id')
    .get(getLoggedinUser)
router
    .route('/users')
    .post(usersLogin)
router
    .route('/me')
    .get(protect, getMe)

module.exports = router;