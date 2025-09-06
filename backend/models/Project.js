const pool = require('../db/db.js');

const ProjectModel = {
    /**
     * Creates a new project, adds the creator as a member, and links any tags.
     */
    async create(projectData, tagIds = []) {
        const { projectName, description, managerId, deadline, priority, imageUrl } = projectData;
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const projectQuery = `
                INSERT INTO projects (project_name, description, manager_id, deadline, priority, image_url)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *`;
            const projectResult = await client.query(projectQuery, [projectName, description, managerId, deadline, priority, imageUrl]);
            const newProject = projectResult.rows[0];

            const memberQuery = `INSERT INTO project_members (project_id, user_id) VALUES ($1, $2)`;
            await client.query(memberQuery, [newProject.project_id, managerId]);

            for (const tagId of tagIds) {
                const tagQuery = `INSERT INTO project_tags (project_id, tag_id) VALUES ($1, $2)`;
                await client.query(tagQuery, [newProject.project_id, tagId]);
            }

            await client.query('COMMIT');
            return newProject;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

    /**
     * Finds a single project by its ID.
     * @param {string} projectId The ID of the project to find.
     * @returns {Promise<object|undefined>} The project object or undefined.
     */
    async findById(projectId) {
        const result = await pool.query("SELECT * FROM projects WHERE project_id = $1", [projectId]);
        return result.rows[0];
    },

    /**
     * Finds all projects a specific user is a member of.
     * @param {string} userId The ID of the user.
     * @returns {Promise<Array<object>>} A list of projects.
     */
    async findProjectsByUserId(userId) {
        const query = `
            SELECT p.* FROM projects p
            JOIN project_members pm ON p.project_id = pm.project_id
            WHERE pm.user_id = $1 ORDER BY p.created_at DESC
        `;
        const result = await pool.query(query, [userId]);
        return result.rows;
    },

    /**
     * Adds a user to a project's members list.
     * @param {string} projectId The ID of the project.
     * @param {string} userId The ID of the user to add.
     * @returns {Promise<object>} The new membership record.
     */
    async addMember(projectId, userId) {
        const query = `INSERT INTO project_members (project_id, user_id) VALUES ($1, $2) RETURNING *`;
        const result = await pool.query(query, [projectId, userId]);
        return result.rows[0];
    },

    /**
     * Gets all members of a specific project.
     * @param {string} projectId The ID of the project.
     * @returns {Promise<Array<object>>} A list of user objects who are members.
     */
    async getMembers(projectId) {
        const query = `
            SELECT u.user_id, u.first_name, u.last_name, u.email 
            FROM users u
            JOIN project_members pm ON u.user_id = pm.user_id
            WHERE pm.project_id = $1
        `;
        const result = await pool.query(query, [projectId]);
        return result.rows;
    },

    /**
     * Checks if a user is a member of a project.
     * @param {string} projectId The ID of the project.
     * @param {string} userId The ID of the user.
     * @returns {Promise<boolean>} True if the user is a member, false otherwise.
     */
    async isProjectMember(projectId, userId) {
        const query = `SELECT COUNT(*) FROM project_members WHERE project_id = $1 AND user_id = $2`;
        const result = await pool.query(query, [projectId, userId]);
        return parseInt(result.rows[0].count, 10) > 0;
    }
};

module.exports = ProjectModel;
