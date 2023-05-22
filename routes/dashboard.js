const express = require('express');
const {
    getactiveads,
    getemptyads,
    getawaitingfiles,
    getpendingfiles,
    getcompletedfiles,
    getverifiedusers,
    getunverifiedusers,
    getsocieties
} = require('../controllers/dashboard');


const router = express.Router();

const advancedResults = require('../middleware/advancedResults');
// const { protect, authorize } = require('../middleware/auth');

// router.use(protect);
// router.use(authorize('admin'));

router
    .route('/activeads')
    .get(getactiveads)
router
    .route('/emptyads')
    .get(getemptyads)
router
    .route('/awaitingfiles')
    .get(getawaitingfiles)
router
    .route('/pendingfiles')
    .get(getpendingfiles)
router
    .route('/completedfiles')
    .get(getcompletedfiles)
router
    .route('/verifiedusers')
    .get(getverifiedusers)
router
    .route('/unverifiedusers')
    .get(getunverifiedusers)
router
    .route('/totalsocieties')
    .get(getsocieties)



module.exports = router;