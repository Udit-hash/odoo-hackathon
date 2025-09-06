const pool = require('../config/db.js');

const ProjectModel = {
    /**
     * Creates a new project, adds the creator as a member, and links any tags.
     * Uses a transaction to ensure all or none of the operations succeed.
     * @param {object} projectData Contains name, description, managerId, etc.
     * @param {Array<string>} tagIds Array of UUIDs for the tags.
     * @returns {Promise<object>} The newly created project object.
     */
    async create(projectData, tagIds = []) {
        const { projectName, description, managerId, deadline, priority, imageUrl } = projectData;
        
        // A client is like a single connection for running multiple queries in a transaction
        const client = await pool.connect();

        try {
            await client.query('BEGIN'); // Start transaction

            // 1. Insert the new project
            const projectQuery = `
                INSERT INTO projects (project_name, description, manager_id, deadline, priority, image_url)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *
            `;
            const projectResult = await client.query(projectQuery, [projectName, description, managerId, deadline, priority, imageUrl]);
            const newProject = projectResult.rows[0];

            // 2. Add the creator as the first member of the project
            const memberQuery = `INSERT INTO project_members (project_id, user_id) VALUES ($1, $2)`;
            await client.query(memberQuery, [newProject.project_id, managerId]);

            // 3. Link the selected tags to the new project
            for (const tagId of tagIds) {
                const tagQuery = `INSERT INTO project_tags (project_id, tag_id) VALUES ($1, $2)`;
                await client.query(tagQuery, [newProject.project_id, tagId]);
            }

            await client.query('COMMIT'); // Commit transaction
            return newProject;

        } catch (error) {
            await client.query('ROLLBACK'); // Roll back on error
            throw error; // Rethrow error to be caught by the controller
        } finally {
            client.release(); // Release the client back to the pool
        }
    }
};

module.exports = ProjectModel;