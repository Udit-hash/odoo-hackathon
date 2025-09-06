const pool = require('../db/db.js');

const TaskModel = {
    /**
     * Creates a new task and links any associated tags.
     * @param {object} taskData Contains all task details.
     * @param {Array<string>} tagIds An array of tag UUIDs to link.
     * @returns {Promise<object>} The newly created task object.
     */
    async create(taskData, tagIds = []) {
        const { title, description, status, projectId, assigneeId, createdById, dueDate, imageUrl } = taskData;
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            // 1. Insert the new task into the 'tasks' table
            const taskQuery = `
                INSERT INTO tasks (title, description, status, project_id, assignee_id, created_by_id, due_date, image_url)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING *
            `;
            const taskResult = await client.query(taskQuery, [title, description, status, projectId, assigneeId, createdById, dueDate, imageUrl]);
            const newTask = taskResult.rows[0];

            // 2. Link the selected tags in the 'task_tags' junction table
            for (const tagId of tagIds) {
                const tagQuery = `INSERT INTO task_tags (task_id, tag_id) VALUES ($1, $2)`;
                await client.query(tagQuery, [newTask.task_id, tagId]);
            }
            
            await client.query('COMMIT');
            return newTask;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
    // You would add other functions here later, like findById, updateStatus, etc.
};

module.exports = TaskModel;