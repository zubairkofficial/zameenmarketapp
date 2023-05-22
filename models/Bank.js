const mongoose = require('mongoose');


const BankSchema = new mongoose.Schema({
    bankName: {
        type: String,
    },
    accountNum: {
        type: String,
    },
    accountTitle: {
        type: String,
    },
    societyId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Society',

    },
    projectId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Project',

    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});


module.exports = mongoose.model('Bank', BankSchema);