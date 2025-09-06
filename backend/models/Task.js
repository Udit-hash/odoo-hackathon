const pool = require('../db/db.js');

const TaskModel = {
    /**
     * Creates a new task and links any associated tags.
     */
    async create(taskData, tagIds = []) {
        const { title, description, status, projectId, assigneeId, createdById, dueDate, imageUrl } = taskData;
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const taskQuery = `
                INSERT INTO tasks (title, description, status, project_id, assignee_id, created_by_id, due_date, image_url)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING *`;
            const taskResult = await client.query(taskQuery, [title, description, status, projectId, assigneeId, createdById, dueDate, imageUrl]);
            const newTask = taskResult.rows[0];

            for (const tagId of tagIds) {
                const tagQuery = `INSERT INTO task_tags(task_id, tag_id) VALUES ($1, $2)`;
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
    },

    /**
     * Finds a single task by its ID.
     * @param {string} taskId The ID of the task to find.
     * @returns {Promise<object|undefined>} The task object or undefined.
     */
    async findById(taskId) {
        const query = `
            SELECT t.*,
                ARRAY_AGG(tt.tag_id) AS tag_ids
            FROM tasks t
            LEFT JOIN task_tags tt ON t.task_id = tt.task_id
            WHERE t.task_id = $1
            GROUP BY t.task_id
        `;
        const result = await pool.query(query, [taskId]);
        return result.rows[0];
    },

    /**
     * Finds all tasks assigned to a specific user.
     */
    async findTasksByAssigneeId(userId) {
        const query = "SELECT * FROM tasks WHERE assignee_id = $1 ORDER BY created_at DESC";
        const result = await pool.query(query, [userId]);
        return result.rows;
    },

    /**
     * Finds all tasks belonging to a specific project.
     */
    async findTasksByProjectId(projectId) {
        const query = "SELECT * FROM tasks WHERE project_id = $1 ORDER BY created_at ASC";
        const result = await pool.query(query, [projectId]);
        return result.rows;
    },

    /**
     * Updates an existing task.
     * @param {string} taskId The ID of the task to update.
     * @param {object} updates An object with the fields to update.
     * @returns {Promise<object|undefined>} The updated task object or undefined.
     */
    async update(taskId, updates) {
        const { title, description, status, assigneeId, dueDate, imageUrl } = updates;
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const updateQuery = `
                UPDATE tasks SET
                    title = COALESCE($1, title),
                    description = COALESCE($2, description),
                    status = COALESCE($3, status),
                    assignee_id = COALESCE($4, assignee_id),
                    due_date = COALESCE($5, due_date),
                    image_url = COALESCE($6, image_url)
                WHERE task_id = $7
                RETURNING *`;
            const result = await client.query(updateQuery, [title, description, status, assigneeId, dueDate, imageUrl, taskId]);

            // You can add logic here to update tags if needed
            
            await client.query('COMMIT');
            return result.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

    /**
     * Deletes a task by its ID.
     * @param {string} taskId The ID of the task to delete.
     * @returns {Promise<boolean>} True if the task was deleted, false otherwise.
     */
    async delete(taskId) {
        const result = await pool.query("DELETE FROM tasks WHERE task_id = $1", [taskId]);
        return result.rowCount > 0;
    }
};

module.exports = TaskModel;
