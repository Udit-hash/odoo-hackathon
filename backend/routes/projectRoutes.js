const express = require('express');
const {
    createProject,
    getMyProjects,
    getProjectById,
    addProjectMember,
    getProjectMembers
} = require('../controllers/projectController.js');
const { authMiddleware } = require('../middleware/authMiddleware.js');

const router = express.Router();

// This line applies the authMiddleware to ALL routes defined in this file.
// It's a clean way to protect every project-related endpoint.
router.use(authMiddleware);

// --- Routes for Projects ---

// @desc    Create a new project
// @route   POST /api/v1/project/
router.post('/', createProject);

// @desc    Get all projects for the logged-in user
// @route   GET /api/v1/project/
router.get('/', getMyProjects);

// @desc    Get a single project's details by its ID
// @route   GET /api/v1/project/:projectId
router.get('/:projectId', getProjectById);


// --- Routes for Project Members ---

// @desc    Add a new member to a project
// @route   POST /api/v1/project/:projectId/members
router.post('/:projectId/members', addProjectMember);

// @desc    Get a list of all members for a project
// @route   GET /api/v1/project/:projectId/members
router.get('/:projectId/members', getProjectMembers);


module.exports = router;