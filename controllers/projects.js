const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const path = require('path')
const fs = require('fs')
const Project = require('../models/Project');

exports.addProject = asyncHandler(async (req, res, next) => {

    let societies = req.body.societyId
    let societyId = []

    let imageFile = req.files.image
    if (!imageFile.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please upload an image file`, 403));
    }
    imageFile.name = `photo_${Date.now()}${path.parse(imageFile.name).ext}`;
    imageFile.mv(`${process.env.FILE_UPLOAD_PATH}/${imageFile.name}`, async err => {
        if (err) {
            console.error(err);
            return next(new ErrorResponse(`Problem with file upload main logo`, 500));
        }
    });
    if (req.body.societyId) {
        if (Array.isArray(societies)) {
            societies.forEach(society => {
                societyId.push(society)
            })
        } else {
            societyId.push(societies)
        }
        let reqObject = {
            projectName: req.body.projectName,
            image: imageFile.name,
            societyId: societyId,
        }
        const project = await Project.create(reqObject);
        res.status(201).json({
            success: true,
            data: project
        });
    } else {
        let reqObject = {
            projectName: req.body.projectName,
            image: imageFile.name,
        }
        const project = await Project.create(reqObject);
        res.status(201).json({
            success: true,
            data: project
        });
    }

})

exports.getProjects = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

exports.getProjectById = asyncHandler(async (req, res, next) => {
    const project = await Project.findById(req.params.id);

    res.status(200).json({
        success: true,
        data: project
    });
});

exports.updateProject = asyncHandler(async (req, res, next) => {

    let id = req.body.id
    console.log(id);
    let project = await Project.findById(id);
    project.projectName = req.body.projectName
    let societyId = []
    if (req.body.societyId) {
        let societies = req.body.societyId
        if (Array.isArray(societies)) {
            societies.forEach(society => {
                societyId.push(society)
            })
        } else {
            societyId.push(societies)
        }
    }
    project.societyId = societyId
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
        let oldImagePath = `./public/uploads/${project.image}`
        fs.unlink(oldImagePath, (error) => {
            if (error) res.status(500).send(error);
        });
        project.image = newImageFile.name
        project.save((error) => {
            if (error) res.status(500).send(error);
            res.status(201).json({
                success: true,
            });
        });
    } else {
        project.image = req.body.image
        project.save((error) => {
            if (error) res.status(500).send(error);
            res.status(201).json({
                success: true,
            });
        });
    }

});
