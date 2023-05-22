const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Slider = require('../models/Slider');
const path = require('path');
const fs = require('fs')


exports.addSlider = asyncHandler(async (req, res, next) => {
    if (!req.files) {
        return next(new ErrorResponse(`Please upload a Image`, 403));
    }

    const sliderFile = req.files.sliderImage;


    // Make sure the image is a photo
    if (!sliderFile.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please upload an image file`, 403));
    }


    // Create custom filename
    sliderFile.name = `photo_${Date.now()}${path.parse(sliderFile.name).ext}`;

    sliderFile.mv(`${process.env.FILE_UPLOAD_PATH}/${sliderFile.name}`, async err => {
        if (err) {
            console.error(err);
            return next(new ErrorResponse(`Problem with file upload`, 500));
        }
    });
    let reqObject
    if (req.body.buttonText) {
        reqObject = {
            sliderImage: sliderFile.name,
            buttonText: req.body.buttonText,
            buttonLink: req.body.buttonLink,
        }
    } else {
        reqObject = {
            sliderImage: sliderFile.name,
            buttonText: null,
            buttonLink: null,
        }
    }
    const slider = await Slider.create(reqObject);

    res.status(201).json({
        success: true,
        data: slider
    });
});

exports.getSliders = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

exports.deleteSlider = asyncHandler(async (req, res, next) => {
    let slider = await Slider.findById(req.params.id);
    let sliderImage = `./public/uploads/${slider.sliderImage}`
    fs.unlink(sliderImage, (error) => {
        if (error) res.status(500).send(error);
    });

    slider.remove()
    res.status(200).json({
        success: true,
        data: {}
    });
});

exports.getSignleSlider = asyncHandler(async (req, res, next) => {
    const slider = await Slider.findById(req.params.id);

    res.status(200).json({
        success: true,
        data: slider
    });
});

exports.updateSlider = asyncHandler(async (req, res, next) => {

    let id = req.body.id
    let reqObject;
    let slider = await Slider.findById(id);
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
        let oldImagePath = `./public/uploads/${slider.sliderImage}`
        fs.unlink(oldImagePath, (error) => {
            if (error) res.status(500).send(error);
        });
        slider.sliderImage = newImageFile.name
        slider.buttonText = req.body.buttonText
        slider.buttonLink = req.body.buttonLink
        slider.save((error) => {
            if (error) res.status(500).send(error);
            res.status(201).json({
                success: true,
            });
        });
    } else {
        slider.sliderImage = req.body.sliderImage
        slider.buttonText = req.body.buttonText
        slider.buttonLink = req.body.buttonLink
        slider.save((error) => {
            if (error) res.status(500).send(error);
            res.status(201).json({
                success: true,
            });
        });
    }

});