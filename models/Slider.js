const mongoose = require('mongoose');

const SliderSchema = new mongoose.Schema({
    sliderImage: {
        type: String,
        required: [true, 'Please add a image'],
    },
    buttonText: {
        type: String,
    },
    buttonLink: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Slider', SliderSchema);