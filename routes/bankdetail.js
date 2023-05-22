const express = require('express');
const {
    addBankDetail,
    getBankDetails,
    deleteBankDetail,
    getSignleBankDetail,
    updateBankDetail
} = require('../controllers/bankdetail');

const BankDetail = require('../models/BankDetail');

const router = express.Router();

const advancedResults = require('../middleware/advancedResults');
// const { protect, authorize } = require('../middleware/auth');

// router.use(protect);
// router.use(authorize('admin'));

router
    .route('/')
    .post(addBankDetail)
    .get(advancedResults(BankDetail), getBankDetails)
    .put(updateBankDetail)
router
    .route('/:id')
    .delete(deleteBankDetail)
    .get(getSignleBankDetail)



module.exports = router;