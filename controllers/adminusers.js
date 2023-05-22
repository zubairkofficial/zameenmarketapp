const crypto = require('crypto');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const sendEmail = require('../utils/sendEmail');
const AdminUser = require('../models/AdminUser');
const path = require('path')
const fs = require('fs')

// @desc      Register user
// @route     POST /api/v1/auth/register
// @access    Public
exports.addUsers = asyncHandler(async(req, res, next) => {
    if (!req.files) {
        return next(new ErrorResponse(`Please upload a Image`, 403));
    }

    let imageFile = req.files.image;


    // Make sure the image is a photo
    if (!imageFile.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please upload an image file`, 403));
    }


    // Create custom filename
    imageFile.name = `photo_${Date.now()}${path.parse(imageFile.name).ext}`;

    imageFile.mv(`${process.env.FILE_UPLOAD_PATH}/${imageFile.name}`, async err => {
        if (err) {
            console.error(err);
            return next(new ErrorResponse(`Problem with file upload`, 500));
        }
    });

    let reqObject
    reqObject = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: imageFile.name,
        password: req.body.password,
        role: req.body.role
    }
    const user = await AdminUser.create(reqObject);

    sendTokenResponse(user, 200, res);
});

exports.getUsers = asyncHandler(async(req, res, next) => {
    res.status(200).json(res.advancedResults);
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
        ),
        httpOnly: true,
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token,
    });
};

exports.deleteUser = asyncHandler(async(req, res, next) => {
    let id = req.query.userId
    let user = await AdminUser.findById(req.params.id);
    if (user.role === 'admin') {
        let count = await AdminUser.count({ role: 'admin' })
        if (count > 1) {
            if (user._id != id) {
                let userImage = `./public/uploads/${user.image}`
                fs.unlink(userImage, (error) => {
                    if (error) res.status(500).send(error);
                });
                user.remove()
                res.status(200).json({
                    success: true,
                    data: {}
                });
            } else {
                res.status(200).json({
                    onlineUser: true,
                    data: {}
                });
            }
        } else {
            res.status(200).json({
                lastUser: true,
                data: {}
            });
        }
    } else {
        let userImage = `./public/uploads/${user.image}`
        fs.unlink(userImage, (error) => {
            if (error) res.status(500).send(error);
        });

        user.remove()
        res.status(200).json({
            success: true,
            data: {}
        });
    }
});

exports.userById = asyncHandler(async(req, res, next) => {
    const user = await AdminUser.findById(req.params.id);

    res.status(200).json({
        success: true,
        data: user
    });
});

exports.updateUser = asyncHandler(async(req, res, next) => {
    console.log(req.body);
    let id = req.body._id
    let user = await AdminUser.findById(id);
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
        let oldImagePath = `./public/uploads/${user.image}`
        fs.unlink(oldImagePath, (error) => {
            if (error) res.status(500).send(error);
        });
        if (req.body.newPassword) {
            user.password = req.body.newPassword
            user.name = req.body.name;
            user.email = req.body.email;
            user.phone = req.body.phone;
            user.role = req.body.role;
            user.image = newImageFile.name
            user.save((error) => {
                if (error) res.status(500).send(error);
                res.status(201).json({
                    success: true,
                });
            });
        } else {
            AdminUser.findByIdAndUpdate(id, {
                $set: { image: newImageFile.name, name: req.body.name, email: req.body.email, phone: req.body.phone, role: req.body.role }
            }, { upsert: true }, function(error, user) {
                if (error) res.status(500).send(error);
                if (user) {
                    return res.status(201).json({ success: true });
                }
            })
        }
    } else {
        if (req.body.newPassword) {
            user.password = req.body.newPassword
            user.name = req.body.name;
            user.email = req.body.email;
            user.phone = req.body.phone;
            user.role = req.body.role;
            user.save((error) => {
                if (error) res.status(500).send(error);
                res.status(201).json({
                    success: true,
                });
            });
        } else {
            AdminUser.findByIdAndUpdate(id, {
                $set: { name: req.body.name, email: req.body.email, phone: req.body.phone, role: req.body.role }
            }, { upsert: true }, function(error, user) {
                if (error) res.status(500).send(error);
                if (user) {
                    return res.status(201).json({ success: true });
                }
            })
        }
    }


});