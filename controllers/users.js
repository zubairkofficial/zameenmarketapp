const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const path = require('path');


exports.createUser = asyncHandler(async(req, res, next) => {
    // if (!req.files) {
    //     return next(new ErrorResponse(`Please upload a file`, 403));
    // }

    const cnic_front_file = req.files.cnic_front;
    const cnic_back_file = req.files.cnic_back;

    // Create custom filename
    cnic_front_file.name = `photo_${Date.now()}${path.parse(cnic_front_file.name).ext}`;

    cnic_front_file.mv(`${process.env.FILE_UPLOAD_PATH}/${cnic_front_file.name}`, async err => {
        if (err) {
            console.error(err);
            return next(new ErrorResponse(`Problem with file upload`, 500));
        }
        cnic_back_file.name = `photo_${Date.now()}${path.parse(cnic_back_file.name).ext}`;
        cnic_back_file.mv(`${process.env.FILE_UPLOAD_PATH}/${cnic_back_file.name}`, async err => {
            if (err) {
                console.error(err);
                return next(new ErrorResponse(`Problem with file upload`, 500));
            }
            reqObject = {
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                ntn: req.body.ntn,
                cnic: req.body.cnic,
                address: req.body.address,
                password: req.body.password,
                cnic_front: cnic_front_file.name,
                cnic_back: cnic_back_file.name
            }
            const user = await User.create(reqObject).catch(err => {
                if (err.code === 11000) {
                    return next(new ErrorResponse('Email Already Exists', 401));
                }
            })

            res.status(201).json({
                success: true,
                data: user
            })
        });

    });

});




exports.getUsers = asyncHandler(async(req, res, next) => {
    res.status(200).json(res.advancedResults);
});

exports.verifyUser = asyncHandler(async(req, res, next) => {
    const id = req.params.id;
    User.findByIdAndUpdate(id, {
        $set: { status: true }
    }, { upsert: true }, function(error, user) {
        if (error) res.status(500).send(error);
        if (user) {
            res.status(200).json({
                success: true,
                data: user
            });
        }
    });
});

exports.unVerifyUser = asyncHandler(async(req, res, next) => {
    const id = req.params.id;
    User.findByIdAndUpdate(id, {
        $set: { status: false }
    }, { upsert: true }, function(error, user) {
        if (error) res.status(500).send(error);
        if (user) {
            res.status(200).json({
                success: true,
                data: user
            });
        }
    });
});


exports.getSingleSignupUser = asyncHandler(async(req, res, next) => {
    const user = await User.findById(req.params.id);

    res.status(200).json({
        success: true,
        data: user
    });
});


exports.deleteUser = asyncHandler(async(req, res, next) => {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success: true,
        data: {}
    });
});