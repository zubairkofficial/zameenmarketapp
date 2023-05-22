const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Society = require('../models/Society');
const PropertyType = require('../models/PropertyType');
const path = require('path');
const fs = require('fs')

exports.addPropertyType = asyncHandler(async(req, res, next) => {

    let imageFiles = req.files.images
    let societies = req.body.societyId
    let projects = req.body.projectId
    let images = []
    let societyId = []
    let projectId = []
    if (imageFiles.length > 1) {
        imageFiles.forEach(image => {
            if (!image.mimetype.startsWith('image')) {
                return next(new ErrorResponse(`Please upload an image file`, 403));
            }
            image.name = `photo_${Date.now()}${path.parse(image.name).ext}`;
            image.mv(`${process.env.FILE_UPLOAD_PATH}/${image.name}`, async err => {
                if (err) {
                    console.error(err);
                    return next(new ErrorResponse(`Problem with file upload main logo`, 500));
                }
            });
            images.push(image.name)
        });
    } else {
        if (!imageFiles.mimetype.startsWith('image')) {
            return next(new ErrorResponse(`Please upload an image file`, 403));
        }
        imageFiles.name = `photo_${Date.now()}${path.parse(imageFiles.name).ext}`;
        imageFiles.mv(`${process.env.FILE_UPLOAD_PATH}/${imageFiles.name}`, async err => {
            if (err) {
                console.error(err);
                return next(new ErrorResponse(`Problem with file upload main logo`, 500));
            }
        });
        images.push(imageFiles.name)
    }
    if (Array.isArray(societies)) {
        societies.forEach(society => {
            societyId.push(society)
        })
    } else {
        societyId.push(societies)
    }
    if (projects) {
        if (Array.isArray(projects)) {
            projects.forEach(project => {
                projectId.push(project)
            })
        } else {
            projectId.push(projects)
        }
    }

    let reqObject = {
        images: images,
        societyId: societyId,
        projectId: projectId,
        propertyType: req.body.propertyType
    }
    const propertyType = await PropertyType.create(reqObject);
    res.status(201).json({
        success: true,
        data: propertyType
    });
})

exports.getPropertyTypes = asyncHandler(async(req, res, next) => {
    const propertyTypes = await PropertyType.find().populate({
            path: 'societyId'
        })
        .populate({
            path: 'projectId'
        })
    res.status(200).json({
        success: true,
        data: propertyTypes
    });
});

exports.getSinglePropertyType = asyncHandler(async(req, res, next) => {
    const propertyType = await PropertyType.findById(req.params.id);

    res.status(200).json({
        success: true,
        data: propertyType
    });
});

exports.editPropertyType = asyncHandler(async(req, res, next) => {
    let id = req.body._id
    let property = await PropertyType.findById(id);
    let newImages
    if (req.files != null) {
        newImages = req.files.newImages
    } else {
        newImages = []
    }
    let allImages = []
    let societies = req.body.societyId
    let societyId = []
    let projects = req.body.projectId
    let projectId = []
    if (newImages.length > 1 && req.files != null) {
        newImages.forEach(image => {
            if (!image.mimetype.startsWith('image')) {
                return next(new ErrorResponse(`Please upload an image file`, 403));
            }
            image.name = `photo_${Date.now()}${path.parse(image.name).ext}`;
            image.mv(`${process.env.FILE_UPLOAD_PATH}/${image.name}`, async err => {
                if (err) {
                    console.error(err);
                    return next(new ErrorResponse(`Problem with file upload main logo`, 500));
                }
            });
            allImages.push(image.name)
        });
    } else if (req.files != null) {
        if (!newImages.mimetype.startsWith('image')) {
            return next(new ErrorResponse(`Please upload an image file`, 403));
        }
        newImages.name = `photo_${Date.now()}${path.parse(newImages.name).ext}`;
        newImages.mv(`${process.env.FILE_UPLOAD_PATH}/${newImages.name}`, async err => {
            if (err) {
                console.error(err);
                return next(new ErrorResponse(`Problem with file upload main logo`, 500));
            }
        });
        allImages.push(newImages.name)

    }
    if (req.body.images) {
        let oldImages = req.body.images.split(",");
        oldImages.forEach(image => {
            allImages.push(image)
        })
    }

    if (Array.isArray(societies)) {
        societies.forEach(society => {
            societyId.push(society)
        })
    } else {
        societyId.push(societies)
    }
    if (projects) {
        if (Array.isArray(projects)) {
            projects.forEach(project => {
                projectId.push(project)
            })
        } else {
            projectId.push(projects)
        }
    }

    property.images = allImages
    property.societyId = societyId
    property.projectId = projectId
    property.propertyType = req.body.propertyType

    property.save((error) => {
        if (error) res.status(500).send(error);
        res.status(201).json({
            success: true,
        });
    });

});

exports.deletePropertyType = asyncHandler(async(req, res, next) => {
    let propertyId = req.params.id

    let propertyType = await PropertyType.findById(req.params.id);
    propertyType.images.forEach(image => {
        let imagePath = `./public/uploads/${image}`
        fs.unlink(imagePath, (error) => {
            if (error) res.status(500).send(error);
        });
    })
    propertyType.remove()
    res.status(200).json({
        success: true,
        data: {}
    });
});

exports.getPropertyTypesBySocietyId = asyncHandler(async(req, res, next) => {
    const propertyTypes = await PropertyType.find({ societyId: req.params.id });

    res.status(200).json({
        success: true,
        data: propertyTypes
    });
});

exports.getPropertyTypesByProjectId = asyncHandler(async(req, res, next) => {
    const propertyTypes = await PropertyType.find({ projectId: req.params.id });

    res.status(200).json({
        success: true,
        data: propertyTypes
    });
});