const crypto = require('crypto');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const sendEmail = require('../utils/sendEmail');
const Purchase = require('../models/Purchase');
const AD = require('../models/ADs');
const path = require('path')
const fs = require('fs')

// @desc      Register user
// @route     POST /api/v1/auth/register
// @access    Public
exports.addOrder = asyncHandler(async(req, res, next) => {
    let ad = await AD.findById(req.body.adId);
    if (ad.remainingQty >= req.body.quantity) {


        let cnic_front = req.files.cnic_front;
        let cnic_back = req.files.cnic_back
        let kin_cnic_front = req.files.kin_cnic_front
        let kin_cnic_back = req.files.kin_cnic_back


        // Create custom filename
        cnic_front.name = `photo_cnic_front_${Date.now()}${path.parse(cnic_front.name).ext}`;
        cnic_front.mv(`${process.env.FILE_UPLOAD_PATH}/${cnic_front.name}`, async err => {
            if (err) {
                console.error(err);
                return next(new ErrorResponse(`Problem with file upload`, 500));
            }
        });

        // Create custom filename
        cnic_back.name = `photo_cnic_back_${Date.now()}${path.parse(cnic_back.name).ext}`;
        cnic_back.mv(`${process.env.FILE_UPLOAD_PATH}/${cnic_back.name}`, async err => {
            if (err) {
                console.error(err);
                return next(new ErrorResponse(`Problem with file upload`, 500));
            }
        });

        // Create custom filename
        kin_cnic_front.name = `photo_kin_cnic_front_${Date.now()}${path.parse(kin_cnic_front.name).ext}`;
        kin_cnic_front.mv(`${process.env.FILE_UPLOAD_PATH}/${kin_cnic_front.name}`, async err => {
            if (err) {
                console.error(err);
                return next(new ErrorResponse(`Problem with file upload`, 500));
            }
        });
        // Create custom filename
        kin_cnic_back.name = `photo_kin_cnic_back_${Date.now()}${path.parse(kin_cnic_back.name).ext}`;
        kin_cnic_back.mv(`${process.env.FILE_UPLOAD_PATH}/${kin_cnic_back.name}`, async err => {
            if (err) {
                console.error(err);
                return next(new ErrorResponse(`Problem with file upload`, 500));
            }
        });
        let reqObject
        reqObject = {
            quantity: req.body.quantity,
            name: req.body.name,
            phone: req.body.phone,
            cnic: req.body.cnic,
            address: req.body.address,
            cnic_front: cnic_front.name,
            cnic_back: cnic_back.name,
            kin_name: req.body.kin_name,
            kin_phone: req.body.kin_phone,
            kin_cnic: req.body.kin_cnic,
            kin_address: req.body.kin_address,
            kin_cnic_front: kin_cnic_front.name,
            kin_cnic_back: kin_cnic_back.name,
            userId: req.body.userId,
            adId: req.body.adId
        }
        const order = await Purchase.create(reqObject);
        let remainingQuantity = ad.remainingQty - order.quantity
        if (order) {
            if (remainingQuantity === 0) {
                AD.findByIdAndUpdate(order.adId, {
                    $set: { remainingQty: remainingQuantity, status: 3 }
                }, { upsert: true }, function(error) {
                    if (error) res.status(500).send(error);
                })
            } else {
                AD.findByIdAndUpdate(order.adId, {
                    $set: { remainingQty: remainingQuantity }
                }, { upsert: true }, function(error) {
                    if (error) res.status(500).send(error);
                })
            }
        }
        res.status(201).json({
            success: true,
            data: order
        });
    } else {
        res.status(201).json({
            lessQuantity: true,
        });
    }
});
exports.getPurchases = asyncHandler(async(req, res, next) => {
    res.status(200).json(res.advancedResults);
});

exports.getOrderById = asyncHandler(async(req, res, next) => {
    const order = await Purchase.findById(req.params.id).populate({
        path: 'userId',
        select: 'name email phone ntn cnic cnic_front cnic_back address status createdAt'
    }).populate({ path: 'adId', populate: [{ path: 'societyId' }, { path: 'projectId' }, { path: 'propertyTypeId' }]})
    .populate('paymentId')

    res.status(200).json({
        success: true,
        data: order
    });
});

exports.deleteOrder = asyncHandler(async(req, res, next) => {
    let order = await Purchase.findById(req.params.id);
    console.log(order);
    let cnic_front = `./public/uploads/${order.cnic_front}`
    fs.unlink(cnic_front, (error) => {
        if (error) res.status(500).send(error);
    });
    let cnic_back = `./public/uploads/${order.cnic_back}`
    fs.unlink(cnic_back, (error) => {
        if (error) res.status(500).send(error);
    });
    let kin_cnic_front = `./public/uploads/${order.kin_cnic_front}`
    fs.unlink(kin_cnic_front, (error) => {
        if (error) res.status(500).send(error);
    });
    let kin_cnic_back = `./public/uploads/${order.kin_cnic_back}`
    fs.unlink(kin_cnic_back, (error) => {
        if (error) res.status(500).send(error);
    });
    let ad = await AD.findById(order.adId);
    ad.remainingQty = ad.remainingQty + order.quantity
    ad.commission = ad.commission
    ad.save();
    order.remove()
    res.status(200).json({
        success: true,
        data: {}
    });
});
