const express = require('express');
const {
    getSocietiesByPropertyTypes,
    getAdsBySocietyIds,
    getAdsBySocietyAndPropertyType,
    getAdsByProjectAndPropertyType,
    getUserFilesByStatus,
    getADDetailsByPurchaseId,
    getAdsByCategoryNumber,
    getPurchasesByUser
} = require('../controllers/mobile');
const { protect } = require('../middleware/auth');

const router = express.Router();

const advancedResults = require('../middleware/advancedResults');

router
    .route('/societiesbypropertytypes/:id')
    .get(getSocietiesByPropertyTypes)
router
    .route('/adsbysocietiesids')
    .post(getAdsBySocietyIds)
//societyid and propertytypeid
router
    .route('/adsbysocietyid/:id')
    .get(getAdsBySocietyAndPropertyType)
//projectId and propertytypeid
router
    .route('/adsbyprojectId/:id')
    .get(getAdsByProjectAndPropertyType)
router
    .route('/userfilesbystatus/:id')
    .get(getUserFilesByStatus)
router
    .route('/adbypurchaseid/:id')
    .get(getADDetailsByPurchaseId)
router
    .route('/adsByCategoryId')
    .get(getAdsByCategoryNumber)
router
    .route('/getPurchases/:id')
    .get(getPurchasesByUser)

module.exports = router;
