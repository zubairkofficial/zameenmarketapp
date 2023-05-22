const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const BankDetail = require('../models/BankDetail');
const path = require('path');
const fs = require('fs')


exports.addBankDetail = asyncHandler(async (req, res, next) => {
    const bankImage = req.files.bankImage;

    // Make sure the image is a photo
    if (!bankImage.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please upload an image file`, 403));
    }


    // Create custom filename
    bankImage.name = `photo_${Date.now()}${path.parse(bankImage.name).ext}`;

    bankImage.mv(`${process.env.FILE_UPLOAD_PATH}/${bankImage.name}`, async err => {
        if (err) {
            console.error(err);
            return next(new ErrorResponse(`Problem with file upload`, 500));
        }
    });
    let reqObject = {
        bankImage: bankImage.name,
        bankName: req.body.bankName,
        branchCode: req.body.branchCode,
        accountNumber: req.body.accountNumber,
        ibanNumber: req.body.ibanNumber,
    }
    const bankDetail = await BankDetail.create(reqObject);

    res.status(201).json({
        success: true,
        data: bankDetail
    });
});

exports.getBankDetails = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

exports.deleteBankDetail = asyncHandler(async (req, res, next) => {
    let bankDetail = await BankDetail.findById(req.params.id);
    let bankDetailImage = `./public/uploads/${bankDetail.bankImage}`
    fs.unlink(bankDetailImage, (error) => {
        if (error) res.status(500).send(error);
    });

    bankDetail.remove()
    res.status(200).json({
        success: true,
        data: {}
    });
});

exports.getSignleBankDetail = asyncHandler(async (req, res, next) => {
    const bankDetail = await BankDetail.findById(req.params.id);

    res.status(200).json({
        success: true,
        data: bankDetail
    });
});

exports.updateBankDetail = asyncHandler(async (req, res, next) => {
    let id = req.body.id
    let reqObject;
    let bankDetail = await BankDetail.findById(id);
    if (req.files) {
        const newImageFile = req.files.newImage;
        if (!newImageFile.mimetype.startsWith('image')) {
            return next(new ErrorResponse(`Please upload an image file`, 403));
        }
        newImageFile.name = `photo_${Date.now()}${path.parse(newImageFile.name).ext}`;
        newImageFile.mv(`${process.env.FILE_UPLOAD_PATH}/${newImageFile.name}`, async err => {
            if (err) {
                console.error(err);
                return next(new ErrorResponse(`Problem with file upload main logo`, 500));
            }
        })
        let oldImagePath = `./public/uploads/${bankDetail.bankImage}`
        fs.unlink(oldImagePath, (error) => {
            if (error) res.status(500).send(error);
        });
        bankDetail.bankImage = newImageFile.name
        bankDetail.bankName = req.body.bankName
        bankDetail.branchCode = req.body.branchCode
        bankDetail.accountNumber = req.body.accountNumber
        bankDetail.ibanNumber = req.body.ibanNumber
        bankDetail.save((error) => {
            if (error) res.status(500).send(error);
            res.status(201).json({
                success: true,
            });
        });
    } else {
        bankDetail.BankDetailImage = req.body.bankImage
        bankDetail.bankName = req.body.bankName
        bankDetail.branchCode = req.body.branchCode
        bankDetail.accountNumber = req.body.accountNumber
        bankDetail.ibanNumber = req.body.ibanNumber
        bankDetail.save((error) => {
            if (error) res.status(500).send(error);
            res.status(201).json({
                success: true,
            });
        });
    }

});