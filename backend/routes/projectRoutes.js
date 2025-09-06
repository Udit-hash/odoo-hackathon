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

router.use(authMiddleware);

router.post('/', createProject);
router.get('/', getMyProjects);
router.get('/:projectId', getProjectById);
router.post('/:projectId/members', addProjectMember);
router.get('/:projectId/members', getProjectMembers);

module.exports = router;
