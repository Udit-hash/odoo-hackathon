const express = require('express');
const { createProject } = require('../controllers/projectController.js');
const { authMiddleware } = require('../middleware/authMiddleware.js');

const router = express.Router();

// This route is protected. A user must be logged in to create a project.
router.post('/', authMiddleware, createProject);

// You will add other project routes here later (e.g., GET /:id)
// router.get('/', authMiddleware, getAllProjects); 

module.exports = router;