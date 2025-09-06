const TaskModel = require('../models/taskModel.js');
const UserModel = require('../models/user.js');
const ProjectModel = require('../models/projectModel.js');
const { getIO, userSockets } = require('../socket');

const createTask = async (req, res) => {
    try {
        const creatorEmail = req.email;
        const creator = await UserModel.findByEmail(creatorEmail);

        const { title, description, status = 'To-Do', projectId, assigneeId, dueDate, imageUrl, tags } = req.body;

        const isCreatorMember = await ProjectModel.isProjectMember(projectId, creator.user_id);
        if (!isCreatorMember) {
            return res.status(403).json({ message: "Forbidden: You are not a member of this project." });
        }

        if (assigneeId) {
            const isAssigneeMember = await ProjectModel.isProjectMember(projectId, assigneeId);
            if (!isAssigneeMember) {
                return res.status(400).json({ message: "Invalid assignee: User is not a member of this project." });
            }
        }

        const taskData = { 
            title, 
            description, 
            status, 
            projectId, 
            assigneeId, 
            createdById: creator.user_id, 
            dueDate, 
            imageUrl 
        };

        const newTask = await TaskModel.create(taskData, tags);

        if (assigneeId) {
            const recipientSocketId = userSockets[assigneeId];
            if (recipientSocketId) {
                const io = getIO();
                const notification = {
                    message: `You have been assigned a new task: "${newTask.title}"`,
                    taskId: newTask.task_id,
                    projectId: newTask.project_id
                };
                io.to(recipientSocketId).emit('new_task_assigned', notification);
            }
        }

        res.status(201).json({ message: "Task created successfully!", task: newTask });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

const getMyTasks = async (req, res) => {
    try {
        const user = await UserModel.findByEmail(req.email);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        const tasks = await TaskModel.findTasksByAssigneeId(user.user_id);
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

const getProjectTasks = async (req, res) => {
    try {
        const { projectId } = req.params;
        const user = await UserModel.findByEmail(req.email);

        const isMember = await ProjectModel.isProjectMember(projectId, user.user_id);
        if (!isMember) {
            return res.status(403).json({ message: "Forbidden: You are not a member of this project." });
        }

        const tasks = await TaskModel.findTasksByProjectId(projectId);
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

module.exports = {
    createTask,
    getMyTasks,
    getProjectTasks
};
