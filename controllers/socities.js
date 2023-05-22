const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Society = require('../models/Society');
const Purchase = require('../models/Purchase');
const AD = require('../models/ADs');
const path = require('path');
const fs = require('fs')

exports.addSociety = asyncHandler(async(req, res, next) => {
    if (!req.files) {
        return next(new ErrorResponse(`Please upload a file`, 400));
    }

    const main_logo_file = req.files.main_logo;
    const ad_logo_file = req.files.ad_logo;

    // Make sure the image is a photo
    if (!main_logo_file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please upload an image file`, 403));
    }
    if (!ad_logo_file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please upload an image file`, 403));
    }

    // Create custom filename
    main_logo_file.name = `photo_${Date.now()}${path.parse(main_logo_file.name).ext}`;

    main_logo_file.mv(`${process.env.FILE_UPLOAD_PATH}/${main_logo_file.name}`, async err => {
        if (err) {
            console.error(err);
            return next(new ErrorResponse(`Problem with file upload main logo`, 500));
        }
        ad_logo_file.name = `photo_${Date.now()}${path.parse(ad_logo_file.name).ext}`;
        ad_logo_file.mv(`${process.env.FILE_UPLOAD_PATH}/${ad_logo_file.name}`, async err => {
            if (err) {
                console.error(err);
                return next(new ErrorResponse(`Problem with file upload ad logo`, 500));
            }
            reqObject = {
                society_name: req.body.society_name,
                main_logo: main_logo_file.name,
                ad_logo: ad_logo_file.name,
            }

            const society = await Society.create(reqObject);
            res.status(201).json({
                success: true,
                data: society
            });
        });
    });
});

exports.getSocieties = asyncHandler(async(req, res, next) => {
    res.status(200).json(res.advancedResults);
});

exports.getSocietyById = asyncHandler(async(req, res, next) => {
    const society = await Society.findById(req.params.id);

    res.status(200).json({
        success: true,
        data: society
    });
});


exports.updateSociety = asyncHandler(async(req, res, next) => {

    let id = req.body._id
    let society = await Society.findById(id);
    if (society.main_logo != req.body.main_logo) {
        const main_logo_file = req.files.main_logo;
        if (!main_logo_file.mimetype.startsWith('image')) {
            return next(new ErrorResponse(`Please upload an image file`, 403));
        }
        main_logo_file.name = `photo_${Date.now()}${path.parse(main_logo_file.name).ext}`;
        main_logo_file.mv(`${process.env.FILE_UPLOAD_PATH}/${main_logo_file.name}`, async err => {
            if (err) {
                console.error(err);
                return next(new ErrorResponse(`Problem with file upload main logo`, 500));
            }
        })
        let imagePath = `./public/uploads/${society.main_logo}`
        fs.unlink(imagePath, (error) => {
            if (error) res.status(500).send(error);
        });
        society.main_logo = main_logo_file.name
    }
    if (society.ad_logo != req.body.ad_logo) {
        const ad_logo_file = req.files.ad_logo;
        if (!ad_logo_file.mimetype.startsWith('image')) {
            return next(new ErrorResponse(`Please upload an image file`, 403));
        }

        ad_logo_file.name = `photo_${Date.now()}${path.parse(ad_logo_file.name).ext}`;
        ad_logo_file.mv(`${process.env.FILE_UPLOAD_PATH}/${ad_logo_file.name}`, async err => {
            if (err) {
                console.error(err);
                return next(new ErrorResponse(`Problem with file upload ad logo`, 500));
            }
        })
        let imagePath = `./public/uploads/${society.ad_logo}`
        fs.unlink(imagePath, (error) => {
            if (error) res.status(500).send(error);
        });
        society.ad_logo = ad_logo_file.name
    }

    society.society_name = req.body.society_name
    society.save((error) => {
        if (error) res.status(500).send(error);
        res.status(201).json({
            success: true,
        });
    });

});

exports.deleteSociety = asyncHandler(async(req, res, next) => {
    let societyId = req.params.id
    let ad = await AD.find({ societyId: societyId })
    if (ad) {
        ad.forEach(async(a) => {
            let purchase = await Purchase.find({ adId: a._id })
            if (purchase) {
                res.status(200).json({
                    order: true,
                });
            }
        })
    } else {
        let society = await Society.findById(req.params.id);
        let mainLogoPath = `./public/uploads/${society.main_logo}`
        fs.unlink(mainLogoPath, (error) => {
            if (error) res.status(500).send(error);
        });
        let ad_logo = `./public/uploads/${society.ad_logo}`
        fs.unlink(ad_logo, (error) => {
            if (error) res.status(500).send(error);
        });

        let propertyTypes = await PropertyType.find();
        propertyTypes.forEach(propertyType => {
            propertyType.societyId.splice(societyId, 1)
            propertyType.save()
        })
        society.remove()
        res.status(200).json({
            success: true,
            data: {}
        });
    }

});