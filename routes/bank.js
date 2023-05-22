const express = require('express');
const {
    getSocieties,
    addBank,
    getBankById,
    updateBank,
    deleteBank,
    getProjects
} = require('../controllers/banks');

const Society = require('../models/Society');
const Project = require('../models/Project');

const router = express.Router();

const advancedResults = require('../middleware/advancedResults');
// const { protect, authorize } = require('../middleware/auth');

// router.use(protect);
// router.use(authorize('admin'));

router
    .route('/society')
    .get(advancedResults(Society, [{
        path: 'bankId',
    }]), getSocieties)
router
    .route('/project')
    .get(advancedResults(Project, [{
        path: 'bankId',
    }]), getProjects)
router
    .route('/')
    .post(addBank)
    .put(updateBank)
router
    .route('/:id')
    .get(getBankById)
    .delete(deleteBank)


module.exports = router;