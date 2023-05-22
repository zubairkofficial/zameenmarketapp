const mongoose = require('mongoose');

const PurchaseSchema = new mongoose.Schema({
    quantity: {
        type: Number,
        required: [true, 'Please select quantity'],
    },
    name: {
        type: String,
        required: [true, 'Please add owner name'],
    },
    phone: {
        type: String,
        required: [true, 'Please add owner phone number'],
    },
    cnic: {
        type: String,
        required: [true, 'Please add owner cnic number'],
    },
    address: {
        type: String,
        required: [true, 'Please add owner address'],
    },
    cnic_front: {
        type: String,
        required: [true, 'Please add owner cnic front'],
    },
    cnic_back: {
        type: String,
        required: [true, 'Please add owner cnic back'],
    },
    kin_name: {
        type: String,
        required: [true, 'Please add kin name'],
    },
    kin_phone: {
        type: String,
        required: [true, 'Please add kin phone number'],
    },
    kin_cnic: {
        type: String,
        required: [true, 'Please add kin cnic number'],
    },
    kin_address: {
        type: String,
        required: [true, 'Please add kin address'],
    },
    kin_cnic_front: {
        type: String,
        required: [true, 'Please add kin cnic front'],
    },
    kin_cnic_back: {
        type: String,
        required: [true, 'Please add kin cnic back'],
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',

    },
    adId: {
        type: mongoose.Schema.ObjectId,
        ref: 'AD',

    },
    purchasedAt: {
        type: Date,
        default: Date.now,
    },
    //1 for awaiting payment | 2 for pending verification | 3 for completed orders
    status: {
        type: Number,
        default: 1,
    },
    paymentId: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Payment',

    }],

});

module.exports = mongoose.model('Purchase', PurchaseSchema);