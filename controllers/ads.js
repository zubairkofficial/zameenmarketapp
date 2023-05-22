const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const AD = require('../models/ADs');
const path = require('path');
const fs = require('fs')

exports.addAD = asyncHandler(async (req, res, next) => {
    console.log(req.files);
    let sliderImages = req.files.sliderImages
    let mainImage = req.files.mainImage
    let installementDet = req.files.installementDet
    let nocDoc = req.files.nocDoc
    let sliderVideo = req.files.sliderVideo

    let allSliderImages = []
    let allInstallementDet = []
    let allNocDoc = []
    let confirmSliderVideo = null

    if (sliderImages.length > 1) {
        sliderImages.forEach(image => {
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
            allSliderImages.push(image.name)
        });
    } else {
        if (!sliderImages.mimetype.startsWith('image')) {
            return next(new ErrorResponse(`Please upload an image file`, 403));
        }
        sliderImages.name = `photo_${Date.now()}${path.parse(sliderImages.name).ext}`;
        sliderImages.mv(`${process.env.FILE_UPLOAD_PATH}/${sliderImages.name}`, async err => {
            if (err) {
                console.error(err);
                return next(new ErrorResponse(`Problem with file upload main logo`, 500));
            }
        });
        allSliderImages.push(sliderImages.name)
    }

    if (mainImage) {

        if (!mainImage.mimetype.startsWith('image')) {
            return next(new ErrorResponse(`Please upload an image file`, 403));
        }


        // Create custom filename
        mainImage.name = `photo_${Date.now()}${path.parse(mainImage.name).ext}`;

        mainImage.mv(`${process.env.FILE_UPLOAD_PATH}/${mainImage.name}`, async err => {
            if (err) {
                console.error(err);
                return next(new ErrorResponse(`Problem with file upload`, 500));
            }
        })
    }
    if (installementDet) {
        if (installementDet.length > 1) {
            installementDet.forEach(image => {
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
                allInstallementDet.push(image.name)
            });
        } else {
            if (!installementDet.mimetype.startsWith('image')) {
                return next(new ErrorResponse(`Please upload an image file`, 403));
            }
            installementDet.name = `photo_${Date.now()}${path.parse(installementDet.name).ext}`;
            installementDet.mv(`${process.env.FILE_UPLOAD_PATH}/${installementDet.name}`, async err => {
                if (err) {
                    console.error(err);
                    return next(new ErrorResponse(`Problem with file upload main logo`, 500));
                }
            });
            allInstallementDet.push(installementDet.name)
        }
    }
    if (nocDoc) {
        if (nocDoc.length > 1) {
            nocDoc.forEach(image => {
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
                allNocDoc.push(image.name)
            });
        } else {
            if (!nocDoc.mimetype.startsWith('image')) {
                return next(new ErrorResponse(`Please upload an image file`, 403));
            }
            nocDoc.name = `photo_${Date.now()}${path.parse(nocDoc.name).ext}`;
            nocDoc.mv(`${process.env.FILE_UPLOAD_PATH}/${nocDoc.name}`, async err => {
                if (err) {
                    console.error(err);
                    return next(new ErrorResponse(`Problem with file upload main logo`, 500));
                }
            });
            allNocDoc.push(nocDoc.name)
        }

    }
    if (sliderVideo) {
        if (!sliderVideo.mimetype.startsWith('video')) {
            return next(new ErrorResponse(`Please upload a video file`, 403));
        }
        sliderVideo.name = `video_${Date.now()}${path.parse(sliderVideo.name).ext}`;
        confirmSliderVideo = sliderVideo.name
        sliderVideo.mv(`${process.env.FILE_UPLOAD_PATH}/${sliderVideo.name}`, async err => {
            if (err) {
                console.error(err);
                return next(new ErrorResponse(`Problem with file upload`, 500));
            }
        })
    }

    let reqObject
    if (req.body.societyId) {
        reqObject = {
            title: req.body.title,
            downPrice: req.body.downPrice,
            totalAmount: req.body.totalAmount,
            commision: req.body.commision,
            remainingQty: req.body.remainingQty,
            sliderImages: allSliderImages,
            sliderVideo: confirmSliderVideo,
            installementDet: allInstallementDet,
            nocDoc: allNocDoc,
            societyId: req.body.societyId,
            propertyTypeId: req.body.propertyTypeId,
            projectId: null,
            description: req.body.description,
            category: req.body.category,
            priority: req.body.priority,
            mainImage: mainImage.name
        }
    }
    if (req.body.projectId) {
        reqObject = {
            title: req.body.title,
            downPrice: req.body.downPrice,
            totalAmount: req.body.totalAmount,
            commision: req.body.commision,
            remainingQty: req.body.remainingQty,
            sliderImages: allSliderImages,
            sliderVideo: confirmSliderVideo,
            installementDet: allInstallementDet,
            nocDoc: allNocDoc,
            propertyTypeId: req.body.propertyTypeId,
            projectId: req.body.projectId,
            societyId: null,
            description: req.body.description,
            category: req.body.category,
            priority: req.body.priority,
            mainImage: mainImage.name
        }
    }
    const ads = await AD.create(reqObject);
    res.status(201).json({
        success: true,
        data: ads
    });
})

exports.getADs = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

exports.getAdById = asyncHandler(async (req, res, next) => {
    const ad = await AD.findById(req.params.id)
        .populate({
            path: 'societyId',
            select: 'society_name'
        })
        .populate({
            path: 'projectId',
            select: 'projectName'
        })
        .populate({
            path: 'propertyTypeId',
            select: 'propertyType'
        })
    res.status(200).json({
        success: true,
        data: ad
    });
});

exports.deleteAd = asyncHandler(async (req, res, next) => {
    let ad = await AD.findById(req.params.id)
    let mainImage = `./public/uploads/${ad.mainImage}`
    fs.unlink(mainImage, (error) => {
        if (error) res.status(500).send(error);
    });
    if (ad.sliderVideo) {
        let sliderVideo = `./public/uploads/${ad.sliderVideo}`
        fs.unlink(sliderVideo, (error) => {
            if (error) res.status(500).send(error);
        });
    }
    let sliderImages = ad.sliderImages
    sliderImages.forEach(image => {
        let link = `./public/uploads/${image}`
        fs.unlink(link, (error) => {
            if (error) res.status(500).send(error);
        });
    })
    if (ad.nocDoc.length > 0) {
        ad.nocDoc.forEach(image => {
            let link = `./public/uploads/${image}`
            fs.unlink(link, (error) => {
                if (error) res.status(500).send(error);
            });
        })
    }
    if (ad.installementDet.length > 0) {
        ad.installementDet.forEach(image => {
            let link = `./public/uploads/${image}`
            fs.unlink(link, (error) => {
                if (error) res.status(500).send(error);
            });
        })
    }

    ad.remove();
    res.status(200).json({
        success: true,
    });
});

exports.getAdForEdit = asyncHandler(async (req, res, next) => {
    let ad = await AD.findById(req.params.id)
    res.status(200).json({
        success: true,
        data: ad
    });
});

exports.updateAd = asyncHandler(async (req, res, next) => {
    let ad = await AD.findById(req.body.id)
    let sliderImages = [];
    let nocDoc = [];
    let installementDet = []
    if (req.body.newMainImage) {
        if (req.files.newMainImage) {
            let mainImage = req.files.newMainImage
            if (!mainImage.mimetype.startsWith('image')) {
                return next(new ErrorResponse(`Please upload an image file`, 403));
            }


            // Create custom filename
            mainImage.name = `photo_${Date.now()}${path.parse(mainImage.name).ext}`;

            mainImage.mv(`${process.env.FILE_UPLOAD_PATH}/${mainImage.name}`, async err => {
                if (err) {
                    console.error(err);
                    return next(new ErrorResponse(`Problem with file upload`, 500));
                }
            })
            ad.mainImage = mainImage.name
        }
    } else {
        ad.mainImage = req.body.mainImage
    }
    if (req.body.newSliderVideo) {
        if (req.files.newSliderVideo) {
            let sliderVideo = req.files.newSliderVideo
            if (!sliderVideo.mimetype.startsWith('video')) {
                return next(new ErrorResponse(`Please upload a video file`, 403));
            }
            sliderVideo.name = `video_${Date.now()}${path.parse(sliderVideo.name).ext}`;
            sliderVideo.mv(`${process.env.FILE_UPLOAD_PATH}/${sliderVideo.name}`, async err => {
                if (err) {
                    console.error(err);
                    return next(new ErrorResponse(`Problem with file upload`, 500));
                }
            })
            ad.sliderVideo = sliderVideo.name
        }
    } else if (req.body.sliderVideo) {
        ad.sliderVideo = req.body.sliderVideo
    } else {
        ad.sliderVideo = null
    }
    if (req.body.newSliderImages) {
        if (req.files.newSliderImages) {
            let newImages = req.files.newSliderImages
            if (newImages.length > 1) {
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
                    sliderImages.push(image.name)
                });
            } else {
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
                sliderImages.push(newImages.name)
            }
        }
    }
    if (req.body.sliderImages) {
        let oldImages = req.body.sliderImages
        if (Array.isArray(oldImages) === true) {
            oldImages.forEach(image => {
                sliderImages.push(image)
            })
        } else {
            sliderImages.push(oldImages)
        }
    }

    if (req.body.newNocDoc) {
        if (req.files.newNocDoc) {
            let newImages = req.files.newNocDoc
            if (newImages.length > 1) {
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
                    nocDoc.push(image.name)
                });
            } else {
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
                nocDoc.push(newImages.name)
            }
        }
    }
    if (req.body.nocDoc) {
        let oldImages = req.body.nocDoc
        if (Array.isArray(oldImages) === true) {
            oldImages.forEach(image => {
                nocDoc.push(image)
            })
        } else {
            nocDoc.push(oldImages)
        }
    }
    if (req.body.newInstallementDet) {
        if (req.files.newInstallementDet) {
            let newImages = req.files.newInstallementDet
            if (newImages.length > 1) {
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
                    installementDet.push(image.name)
                });
            } else {
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
                installementDet.push(newImages.name)
            }
        }
    }
    if (req.body.installementDet) {
        let oldImages = req.body.installementDet
        if (Array.isArray(oldImages) === true) {
            oldImages.forEach(image => {
                installementDet.push(image)
            })
        } else {
            installementDet.push(oldImages)
        }
    }
    if (req.body.projectId) {
        ad.projectId = req.body.projectId
        ad.societyId = null
    }
    if (req.body.societyId) {
        ad.societyId = req.body.societyId
        ad.projectId = null
    }
    if (ad.status === 3) {
        if (req.body.remainingQty > 0) {
            ad.status = 1
        }
    }
    ad.title = req.body.title
    ad.downPrice = req.body.downPrice
    ad.totalAmount = req.body.totalAmount
    ad.commision = req.body.commision
    ad.remainingQty = req.body.remainingQty
    ad.sliderImages = sliderImages
    ad.installementDet = installementDet
    ad.nocDoc = nocDoc
    ad.societyId = req.body.societyId
    ad.propertyTypeId = req.body.propertyTypeId
    ad.description = req.body.description
    ad.category = req.body.category
    ad.priority = req.body.priority
    // ad.commisionAmount = await ad.calculatePercentage(req.body.commision);
    ad.save();
    res.status(201).json({
        success: true,
    });
})

exports.disableAd = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    AD.findByIdAndUpdate(id, {
        $set: { status: 2 }
    }, { upsert: true }, function (error, ad) {
        if (error) res.status(500).send(error);
        if (ad) {
            res.status(200).json({
                success: true,
                data: ad
            });
        }
    });
});

exports.activateAd = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    AD.findByIdAndUpdate(id, {
        $set: { status: 1 }
    }, { upsert: true }, function (error, ad) {
        if (error) res.status(500).send(error);
        if (ad) {
            res.status(200).json({
                success: true,
                data: ad
            });
        }
    });
});