const ProjectModel = require('../models/Project.js');

const createProject = async (req, res) => {
    try {
        // req.userId is added by your authMiddleware.
        // It's the ID of the logged-in user, who will become the manager.
        const managerId = req.userId; 

        // Get project details from the request body
        const {
            projectName,
            description,
            deadline,
            priority,
            imageUrl,
            tags // Expects an array of tag_ids, e.g., ["uuid1", "uuid2"]
        } = req.body;

        const projectData = { projectName, description, managerId, deadline, priority, imageUrl };
        
        // Call the model to create the project
        const newProject = await ProjectModel.create(projectData, tags);

        res.status(201).json({ message: "Project created successfully!", project: newProject });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

module.exports = {
    createProject
};