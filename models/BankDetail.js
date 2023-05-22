const mongoose = require('mongoose');

const BankDetailSchema = new mongoose.Schema({
    bankImage: {
        type: String,
    },
    bankName: {
        type: String,
    },
    branchCode: {
        type: String,
    },
    accountNumber: {
        type: String,
    },
    ibanNumber: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('BankDetail', BankDetailSchema);