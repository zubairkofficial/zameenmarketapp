const express = require('express');
const {
    createUser,
    getUsers,
    verifyUser,
    unVerifyUser,
    getSingleSignupUser,
    deleteUser
} = require('../controllers/users');

const User = require('../models/User');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
// const { protect, authorize } = require('../middleware/auth');

// router.use(protect);
// router.use(authorize('admin'));

router
    .route('/')
    .get(advancedResults(User), getUsers)
    .post(createUser);

router
    .route('/:id')
    .delete(deleteUser);

router
    .route('/markverified/:id')
    .put(verifyUser)

router
    .route('/markunverified/:id')
    .put(unVerifyUser)

router
    .route('/signupusers/:id')
    .get(getSingleSignupUser)

module.exports = router;