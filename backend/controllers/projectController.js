const ProjectModel = require('../models/Project.js');
const UserModel = require('../models/user.js'); // Required to find the user by email

const createProject = async (req, res) => {
    try {
        // Step 1: Get the manager's email from the authMiddleware.
        const managerEmail = req.email;

        // Step 2: Use the email to find the full user record to get their ID.
        const manager = await UserModel.findByEmail(managerEmail);
        if (!manager) {
            return res.status(404).json({ message: "Authenticated user not found in database." });
        }
        const managerId = manager.user_id;

        // Step 3: Get project details from the request body.
        const {
            projectName,
            description,
            deadline,
            priority,
            imageUrl,
            tags // Expects an array of tag_ids
        } = req.body;

        const projectData = { projectName, description, managerId, deadline, priority, imageUrl };
        
        // Step 4: Call the model to create the project with the retrieved managerId.
        const newProject = await ProjectModel.create(projectData, tags);

        res.status(201).json({ message: "Project created successfully!", project: newProject });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

module.exports = {
    createProject
};