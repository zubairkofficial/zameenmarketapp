const express = require('express');
const {
    addOrder,
    getPurchases,
    getOrderById,
    deleteOrder
} = require('../controllers/purchases');
const Purchases = require('../models/Purchase');
const advancedResults = require('../middleware/advancedResults');
const router = express.Router();


router
    .route('/')
    .post(addOrder)
    .get(advancedResults(Purchases, [{
            path: 'userId',
            select: 'name email phone ntn cnic cnic_front cnic_back, address status createdAt'
        }, { path: 'adId', populate: [{ path: 'societyId' }, { path: 'projectId' }, { path: 'propertyTypeId' }] }]),
        getPurchases)
router
    .route('/:id')
    .get(getOrderById)
    .delete(deleteOrder)


module.exports = router;