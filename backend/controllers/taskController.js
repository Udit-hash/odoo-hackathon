const TaskModel = require('../models/taskModel.js');
const UserModel = require('../models/user.js');
const ProjectModel = require('../models/projectModel.js'); // Needed for permission checks

const createTask = async (req, res) => {
    try {
        const creatorEmail = req.email; // Email of the logged-in user creating the task
        const creator = await UserModel.findByEmail(creatorEmail);

        const {
            title,
            description,
            status = 'To-Do', // Default to 'To-Do' if not provided
            projectId,
            assigneeId, // The user_id of the person the task is assigned to
            dueDate,
            imageUrl,
            tags // An array of tag_ids
        } = req.body;

        // --- Security Checks ---
        // 1. Check if the creator is a member of the project.
        const isCreatorMember = await ProjectModel.isProjectMember(projectId, creator.user_id);
        if (!isCreatorMember) {
            return res.status(403).json({ message: "Forbidden: You are not a member of this project." });
        }

        // 2. If assigning to someone, check if the assignee is also a member of the project.
        if (assigneeId) {
            const isAssigneeMember = await ProjectModel.isProjectMember(projectId, assigneeId);
            if (!isAssigneeMember) {
                return res.status(400).json({ message: "Invalid assignee: The user you are assigning this task to is not a member of this project." });
            }
        }

        const taskData = {
            title,
            description,
            status,
            projectId,
            assigneeId,
            createdById: creator.user_id, // The logged-in user is the creator
            dueDate,
            imageUrl
        };
        
        const newTask = await TaskModel.create(taskData, tags);

        res.status(201).json({ message: "Task created and assigned successfully!", task: newTask });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

module.exports = {
    createTask
};