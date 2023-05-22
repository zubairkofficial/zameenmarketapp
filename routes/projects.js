const express = require('express');
const {
    addProject,
    getProjects,
    getProjectById,
    updateProject
} = require('../controllers/projects');
const advancedResults = require('../middleware/advancedResults');
const Project = require('../models/Project');

const router = express.Router();

router
    .route('/')
    .get(
        advancedResults(Project, {
            path: 'societyId',
        }),
        getProjects
    )
    .post(addProject)
    .put(updateProject)
router
    .route('/:id')
    .get(getProjectById)



module.exports = router;