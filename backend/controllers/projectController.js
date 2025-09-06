const ProjectModel = require('../models/Project.js');
const UserModel = require('../models/user.js');

const createProject = async (req, res) => {
    try {
        const managerEmail = req.email;
        const manager = await UserModel.findByEmail(managerEmail);
        if (!manager) {
            return res.status(404).json({ message: "Authenticated user not found." });
        }
        const managerId = manager.user_id;

        const { projectName, description, deadline, priority, imageUrl, tags } = req.body;
        const projectData = { projectName, description, managerId, deadline, priority, imageUrl };
        
        const newProject = await ProjectModel.create(projectData, tags);

        res.status(201).json({ message: "Project created successfully!", project: newProject });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

const getMyProjects = async (req, res) => {
    try {
        const user = await UserModel.findByEmail(req.email);
        const projects = await ProjectModel.findProjectsByUserId(user.user_id);
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

const getProjectById = async (req, res) => {
    try {
        const { projectId } = req.params;
        const project = await ProjectModel.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: "Project not found." });
        }

        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

const addProjectMember = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { email } = req.body;

        const userToAdd = await UserModel.findByEmail(email);
        if (!userToAdd) {
            return res.status(404).json({ message: "User to be added not found." });
        }

        const newMember = await ProjectModel.addMember(projectId, userToAdd.user_id);
        res.status(201).json({ message: "User added to project successfully!", membership: newMember });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

const getProjectMembers = async (req, res) => {
    try {
        const { projectId } = req.params;
        const members = await ProjectModel.getMembers(projectId);
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

module.exports = {
    createProject,
    getMyProjects,
    getProjectById,
    addProjectMember,
    getProjectMembers
};
