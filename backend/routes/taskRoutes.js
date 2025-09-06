const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware.js');
const { createTask, getMyTasks, getProjectTasks } = require('../controllers/taskController.js');

const router = express.Router();

// All task routes should be protected.
router.use(authMiddleware);

// POST /api/v1/tasks - Create a new task
router.post('/', createTask);

// --- FIXED ---
// GET /api/v1/tasks - Get tasks for the logged-in user (for the dashboard)
router.get('/', getMyTasks);

// --- ADDED ---
// GET /api/v1/tasks/project/:projectId - Get all tasks for a specific project
router.get('/project/:projectId', getProjectTasks);

module.exports = router;
