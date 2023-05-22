const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Bank = require('../models/Bank');
const Society = require('../models/Society');
const Project = require('../models/Project');
const path = require('path');
const fs = require('fs')

exports.getSocieties = asyncHandler(async(req, res, next) => {
    res.status(200).json(res.advancedResults);
});

exports.addBank = asyncHandler(async(req, res, next) => {
    console.log(req.body);
    const bank = await Bank.create(req.body);
    if (bank.societyId) {
        const fieldsToUpdate = {
            bankId: bank._id,
        };
        await Society.findByIdAndUpdate(bank.societyId, fieldsToUpdate, {
            new: true,
            runValidators: true,
        })
    }
    if (bank.projectId) {
        const fieldsToUpdate = {
            bankId: bank._id,
        };
        await Project.findByIdAndUpdate(bank.projectId, fieldsToUpdate, {
            new: true,
            runValidators: true,
        })
    }
    res.status(201).json({
        success: true,
        data: bank
    });
});

exports.getBankById = asyncHandler(async(req, res, next) => {
    const bank = await Bank.findById(req.params.id).populate([{
        path: "societyId"
    }, { path: "projectId" }])

    res.status(200).json({
        success: true,
        data: bank
    });
});

exports.updateBank = asyncHandler(async(req, res, next) => {
    let id = req.body.id
    let bank = await Bank.findById(id);
    bank.bankName = req.body.bankName
    bank.accountNum = req.body.accountNum
    bank.accountTitle = req.body.accountTitle
    bank.save((error) => {
        if (error) res.status(500).send(error);
        res.status(201).json({
            success: true,
        });
    });
})

exports.deleteBank = asyncHandler(async(req, res, next) => {
    let bank = await Bank.findById(req.params.id);
    if (bank.societyId) {
        let society = await Society.findById(bank.societyId);
        society.set('bankId', null);
        society.save();
    }
    if (bank.projectId) {
        let project = await Project.findById(bank.projectId);
        project.set('bankId', null);
        project.save();
    }
    bank.remove()
    res.status(200).json({
        success: true,
        data: {}
    });
});

exports.getProjects = asyncHandler(async(req, res, next) => {
    res.status(200).json(res.advancedResults);
});