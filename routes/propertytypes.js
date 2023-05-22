const express = require('express');
const {
    addPropertyType,
    getPropertyTypes,
    getSinglePropertyType,
    editPropertyType,
    deletePropertyType,
    getPropertyTypesBySocietyId,
    getPropertyTypesByProjectId
} = require('../controllers/propertytypes');

const Society = require('../models/Society');
const router = express.Router();


router
    .route('/')
    .get(getPropertyTypes)
    .post(addPropertyType)
    .put(editPropertyType)
router
    .route('/:id')
    .get(getSinglePropertyType)
    .delete(deletePropertyType)
router
    .route('/society/:id')
    .get(getPropertyTypesBySocietyId)
router
    .route('/project/:id')
    .get(getPropertyTypesByProjectId)

module.exports = router;