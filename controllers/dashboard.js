const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Ads = require('../models/ADs');
const Purchase = require('../models/Purchase');
const User = require('../models/User');
const Society = require('../models/Society');

exports.getactiveads = asyncHandler(async (req, res, next) => {
    const ads = await Ads.find({ status: 1 });
    res.status(200).json({
        success: true,
        count: ads.length
    });
});
exports.getemptyads = asyncHandler(async (req, res, next) => {
    const ads = await Ads.find({ status: 3 });
    res.status(200).json({
        success: true,
        count: ads.length
    });
});

exports.getawaitingfiles = asyncHandler(async (req, res, next) => {
    const purchases = await Purchase.find({ status: 1 });
    res.status(200).json({
        success: true,
        count: purchases.length
    });
});

exports.getpendingfiles = asyncHandler(async (req, res, next) => {
    const purchases = await Purchase.find({ status: 2 });
    res.status(200).json({
        success: true,
        count: purchases.length
    });
});
exports.getcompletedfiles = asyncHandler(async (req, res, next) => {
    const purchases = await Purchase.find({ status: 3 });
    res.status(200).json({
        success: true,
        count: purchases.length
    });
});
exports.getverifiedusers = asyncHandler(async (req, res, next) => {
    const users = await User.find({ status: true });
    res.status(200).json({
        success: true,
        count: users.length
    });
});
exports.getunverifiedusers = asyncHandler(async (req, res, next) => {
    const users = await User.find({ status: false });
    res.status(200).json({
        success: true,
        count: users.length
    });
});
exports.getsocieties = asyncHandler(async (req, res, next) => {
    const societies = await Society.find();
    res.status(200).json({
        success: true,
        count: societies.length
    });
});