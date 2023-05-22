const mongoose = require('mongoose');
const Society = require('../models/Society');

const PropertyTypeSchema = new mongoose.Schema({
    propertyType: {
        type: String,
        trim: true,

    },
    images: [{
        type: String,
    }],
    societyId: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Society',

    }],
    projectId: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Project',

    }],
});


module.exports = mongoose.model('PropertyTypes', PropertyTypeSchema);