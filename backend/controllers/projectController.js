const ProjectModel = require('../models/Project.js');
const UserModel = require('../models/user.js'); // Required to find users by email

/**
 * Creates a new project. The logged-in user becomes the manager.
 */
const createProject = async (req, res) => {
    try {
        const managerEmail = req.email; // From authMiddleware
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

/**
 * Gets all projects that the logged-in user is a member of.
 */
const getMyProjects = async (req, res) => {
    try {
        const user = await UserModel.findByEmail(req.email);
        const projects = await ProjectModel.findProjectsByUserId(user.user_id);
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

/**
 * Gets the details of a single project by its ID.
 */
const getProjectById = async (req, res) => {
    try {
        const { projectId } = req.params;
        const project = await ProjectModel.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: "Project not found." });
        }
        
        // In a real app, you would add a security check here to ensure
        // the logged-in user is a member of this project before returning it.

        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

/**
 * Adds a new member to a project.
 */
const addProjectMember = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { email } = req.body; // Email of the user to add

        // Find the user you want to add by their email
        const userToAdd = await UserModel.findByEmail(email);
        if (!userToAdd) {
            return res.status(404).json({ message: "User to be added not found." });
        }

        // In a real app, you'd also check if the person making the request
        // is the manager of this project before allowing them to add members.

        const newMember = await ProjectModel.addMember(projectId, userToAdd.user_id);
        res.status(201).json({ message: "User added to project successfully!", membership: newMember });

    } catch (error) {
        // This will catch errors, including if the user is already a member
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

/**
 * Gets a list of all members for a specific project.
 */
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