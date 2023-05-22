const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Society = require('../models/Society');
const AD = require('../models/ADs');
const Purchase = require('../models/Purchase');
const PropertyType = require('../models/PropertyType');



exports.getSocietiesByPropertyTypes = asyncHandler(async (req, res, next) => {
    const societies = await PropertyType.findById(req.params.id).populate({
        path: 'societyId'
    })

    res.status(200).json({
        success: true,
        data: societies.societyId
    });
});

exports.getAdsBySocietyIds = asyncHandler(async (req, res, next) => {
    let societies = req.body.societies
    if (societies.length > 1) {
        let data = await AD.find().where('societyId').in(societies).populate({
            path: 'societyId'
        }).populate({
            path: 'propertyTypeId'
        }).exec()
        res.status(200).json({
            success: true,
            data: data
        });
    } else {
        let data = await AD.find({ societyId: societies }).populate({
            path: 'societyId'
        }).populate({
            path: 'propertyTypeId'
        })
        res.status(200).json({
            success: true,
            data: data
        });
    }
});

exports.getAdsBySocietyAndPropertyType = asyncHandler(async (req, res, next) => {
    let societyId = req.params.id
    if (req.query.propertytypeid) {
        let propertyTypeId = req.query.propertytypeid
        let ads = await AD.find({ societyId: societyId, propertyTypeId: propertyTypeId })
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
            data: ads
        });
    } else {
        let ads = await AD.find({ societyId: societyId })
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
            data: ads
        });
    }
});

exports.getAdsByProjectAndPropertyType = asyncHandler(async (req, res, next) => {
    let projectId = req.params.id
    if (req.query.propertytypeid) {
        let propertyTypeId = req.query.propertytypeid
        let ads = await AD.find({ projectId: projectId, propertyTypeId: propertyTypeId })
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
            data: ads
        });
    } else {
        let ads = await AD.find({ projectId: projectId })
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
            data: ads
        });
    }
});

exports.getUserFilesByStatus = asyncHandler(async (req, res, next) => {
    let userId = req.params.id
    if (req.query.status) {
        let status = req.query.status
        let purchases = await Purchase.find({ userId: userId, status: status })
            .populate({ path: 'adId', populate: [{ path: 'societyId' }, { path: 'projectId' }, { path: 'propertyTypeId' }] })
        res.status(200).json({
            success: true,
            count: purchases.length,
            data: purchases
        });
    } else {
        let purchases = await Purchase.find({ userId: userId })
            .populate({ path: 'adId', populate: [{ path: 'societyId' }, { path: 'projectId' }, { path: 'propertyTypeId' }] })
        let awaiting = await Purchase.find({ userId: userId, status: 1 })
        let pending = await Purchase.find({ userId: userId, status: 2 })
        let completed = await Purchase.find({ userId: userId, status: 3 })
        res.status(200).json({
            success: true,
            awaiting: awaiting.length,
            pending: pending.length,
            completed: completed.length,
            data: purchases
        });
    }
});

exports.getADDetailsByPurchaseId = asyncHandler(async (req, res, next) => {
    let purchaseId = req.params.id
    let purchase = await Purchase.findOne({ purchaseId: purchaseId })
        .populate({ path: 'adId', populate: [{ path: 'societyId' }, { path: 'projectId' }, { path: 'propertyTypeId' }] })
    res.status(200).json({
        success: true,
        data: purchase
    });

});

exports.getAdsByCategoryNumber = asyncHandler(async (req, res, next) => {
    if (req.query.category) {
        let category = req.query.category
        let ads = await AD.find({ category: category, status: 1 })
            .populate({
                path: 'projectId',
            })
            .populate({
                path: 'societyId',
            })
            .populate({
                path: 'propertyTypeId',
                select: 'propertyType'
            })
        res.status(200).json({
            success: true,
            data: ads

        });
    } else {
        let ads = await AD.find({ status: 1 })
            .populate({
                path: 'projectId',
            })
            .populate({
                path: 'societyId',
            })
            .populate({
                path: 'propertyTypeId',
                select: 'propertyType'
            })
        res.status(200).json({
            success: true,
            data: ads

        });
    }
});
exports.getPurchasesByUser = asyncHandler(async (req, res, next) => {
    let userId = req.params.id
    if (req.query.status) {
        let purchases = await Purchase.find({ userId: userId, status: req.query.status })
            .populate({ path: 'adId', populate: [{ path: 'societyId' }, { path: 'projectId' }, { path: 'propertyTypeId' }] })
            .populate({
                path: 'userId',
                select: 'name email phone ntn cnic cnic_front cnic_back, address status createdAt'
            })
            .populate({
                path: 'paymentId',
            })
        res.status(200).json({
            success: true,
            data: purchases
        });
    } else {
        let purchases = await Purchase.find({ userId: userId })
            .populate({ path: 'adId', populate: [{ path: 'societyId' }, { path: 'projectId' }, { path: 'propertyTypeId' }] })
            .populate({
                path: 'userId',
                select: 'name email phone ntn cnic cnic_front cnic_back, address status createdAt'
            })
            .populate({
                path: 'paymentId',
            })
        res.status(200).json({
            success: true,
            data: purchases
        });
    }

});
