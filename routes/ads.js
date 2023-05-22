const express = require('express');
const {
    addAD,
    getADs,
    getAdById,
    deleteAd,
    getAdForEdit,
    updateAd,
    disableAd,
    activateAd
} = require('../controllers/ads');

const AD = require('../models/ADs');
const advancedResults = require('../middleware/advancedResults');
const router = express.Router();

router
    .route('/')
    .post(addAD)
    .get(advancedResults(AD, [{
        path: 'societyId',
        select: 'society_name'
    }, { path: 'projectId', select: 'projectName' }, { path: 'propertyTypeId', select: 'propertyType' }]), getADs)
    .put(updateAd)
router
    .route('/:id')
    .get(advancedResults(AD, [{
        path: 'societyId',
        select: 'society_name'
    }, { path: 'projectId', select: 'projectName' }, { path: 'propertyTypeId', select: 'propertyType' }]), getAdById)
    .delete(deleteAd)
router
    .route('/edit/:id')
    .get(getAdForEdit)
router
    .route('/disable/:id')
    .put(disableAd)
router
    .route('/active/:id')
    .put(activateAd)

module.exports = router;