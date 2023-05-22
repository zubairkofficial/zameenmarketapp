const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    paymentPicture: {
        type: String,
    },
    paymentAmount: {
        type: String,
    },
    paymentDate: {
        type: String,
    },
    bankName: {
        type: String,
    },
    bankAccountNumber: {
        type: String,
    },
    purchaseId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Purchase',
    }
});

module.exports = mongoose.model('Payment', PaymentSchema);