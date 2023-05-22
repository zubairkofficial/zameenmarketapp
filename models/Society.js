const mongoose = require('mongoose');
const PropertyType = require('../models/PropertyType');
const SocietySchema = new mongoose.Schema({
    society_name: {
        type: String,
        trim: true,
        required: [true, 'Please add sociey name'],
        maxlength: 100
    },
    main_logo: {
        type: String,
        required: [true, 'Please add main logo image']
    },
    ad_logo: {
        type: String,
        required: [true, 'Please add ad logo image']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bankId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bank',
    }

});



module.exports = mongoose.model('Society', SocietySchema);