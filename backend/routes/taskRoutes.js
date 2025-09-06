const express = require('express');
const { createTask } = require('../controllers/taskController.js');
const { authMiddleware } = require('../middleware/authMiddleware.js');

const router = express.Router();

// All task routes should be protected.
router.use(authMiddleware);

// POST /api/v1/task - Create a new task
router.post('/', createTask);

// You will add other task routes here later (e.g., PUT /:taskId/status)

module.exports = router;