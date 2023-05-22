const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Payment = require('../models/Payment');
const Purchase = require('../models/Purchase');
const path = require('path');
const fs = require('fs')

exports.addPayment = asyncHandler(async (req, res, next) => {
    console.log(req.body);
    if (!req.files) {
        return next(new ErrorResponse(`Please upload a Image`, 403));
    }

    const paymentPicture = req.files.paymentPicture;


    // Create custom filename
    paymentPicture.name = `photo_${Date.now()}${path.parse(paymentPicture.name).ext}`;

    paymentPicture.mv(`${process.env.FILE_UPLOAD_PATH}/${paymentPicture.name}`, async err => {
        if (err) {
            console.error(err);
            return next(new ErrorResponse(`Problem with file upload`, 500));
        }
    });
    let reqObject = {
        paymentPicture: paymentPicture.name,
        paymentAmount: req.body.paymentAmount,
        paymentDate: req.body.paymentDate,
        bankName: req.body.bankName,
        bankAccountNumber: req.body.bankAccountNumber,
        purchaseId: req.body.purchaseId
    }

    const payment = await Payment.create(reqObject);
    if (payment) {
        let purchase = await Purchase.findById(payment.purchaseId)
        purchase.status = 2;
        purchase.paymentId.push(payment._id)
        purchase.save();
    }
    res.status(201).json({
        success: true,
        data: payment
    });
});
exports.verifyPayment = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    Purchase.findByIdAndUpdate(id, {
        $set: { status: 3 }
    }, { upsert: true }, function (error, purchase) {
        if (error) res.status(500).send(error);
        if (purchase) {
            res.status(200).json({
                success: true,
            });
        }
    });
});
exports.unVerifyPayment = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    Purchase.findByIdAndUpdate(id, {
        $set: { status: 2 }
    }, { upsert: true }, function (error, purchase) {
        if (error) res.status(500).send(error);
        if (purchase) {
            res.status(200).json({
                success: true,
            });
        }
    });
});
exports.paymentDetail = asyncHandler(async (req, res, next) => {
    const payment = await Payment.findOne({ purchaseId: req.params.id })
    res.status(200).json({
        success: true,
        data: payment
    });
});