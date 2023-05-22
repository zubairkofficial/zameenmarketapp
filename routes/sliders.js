const express = require('express');
const {
    addSlider,
    getSliders,
    deleteSlider,
    getSignleSlider,
    updateSlider
} = require('../controllers/sliders');

const Sliders = require('../models/Slider');

const router = express.Router();

const advancedResults = require('../middleware/advancedResults');
// const { protect, authorize } = require('../middleware/auth');

// router.use(protect);
// router.use(authorize('admin'));

router
    .route('/')
    .post(addSlider)
    .get(advancedResults(Sliders), getSliders)
    .put(updateSlider)
router
    .route('/:id')
    .delete(deleteSlider)
    .get(getSignleSlider)



module.exports = router;