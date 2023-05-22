const express = require('express');
const {
    addPayment,
    verifyPayment,
    unVerifyPayment,
    paymentDetail
} = require('../controllers/payments');
const Purchases = require('../models/Purchase');
const advancedResults = require('../middleware/advancedResults');
const router = express.Router();


router
    .route('/')
    .post(addPayment)
router
    .route('/verify/:id')
    .put(verifyPayment)
router
    .route('/unverify/:id')
    .put(unVerifyPayment)
router
    .route('/purchase/:id')
    .get(paymentDetail)


module.exports = router;