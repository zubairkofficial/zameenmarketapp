const mongoose = require('mongoose');

const ADSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
    },
    downPrice: {
        type: Number,
    },
    totalAmount: {
        type: Number,
    },
    commision: {
        type: Number,
    },
    commisionAmount: {
        type: Number,
    },
    remainingQty: {
        type: Number,
    },
    sliderImages: [{
        type: String,
    }],
    sliderVideo: {
        type: String,
    },
    description: {
        type: String
    },
    category: {
        type: Number,
    },
    priority: {
        type: Boolean
    },
    mainImage: {
        type: String,
    },
    installementDet: [{
        type: String,
    }],
    nocDoc: [{
        type: String,
    }],
    societyId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Society',

    },
    propertyTypeId: {
        type: mongoose.Schema.ObjectId,
        ref: 'PropertyTypes',

    },
    projectId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Project',

    },
    status: {
        type: Number,
        default: 1
    }
});

ADSchema.pre('save', function(next) {
    this.commisionAmount = this.totalAmount / 100 * this.commision
    next();
})
ADSchema.pre('update', function(next) {
    this.commisionAmount = this.totalAmount / 100 * this.commision
    next();
})
ADSchema.methods.calculatePercentage = async function(commision) {
    return this.commisionAmount = this.totalAmount / 100 * commision
};

module.exports = mongoose.model('AD', ADSchema);