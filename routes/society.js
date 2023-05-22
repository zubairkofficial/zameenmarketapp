const express = require('express');
const {
    addSociety,
    getSocieties,
    getSocietyById,
    updateSociety,
    deleteSociety,
} = require('../controllers/socities');

const Society = require('../models/Society');
const router = express.Router();

const advancedResults = require('../middleware/advancedResults');

router
    .route('/')
    .post(addSociety)
    .put(updateSociety)
    .get(advancedResults(Society), getSocieties)
router
    .route('/:id')
    .get(getSocietyById)
    .delete(deleteSociety)

module.exports = router;