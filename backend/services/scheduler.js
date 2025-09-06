const cron = require('node-cron');
const pool = require('../db/db.js');
const { getIO, userSockets } = require('../socket'); // Import from the socket manager

const checkDeadlines = () => {
    // Runs every day at 9:00 AM your server's time
    cron.schedule('0 9 * * *', async () => {
        const io = getIO();
        console.log('Scheduler: Running daily deadline check...');
        try {
            const query = `
                SELECT t.title, t.task_id, p.project_name, t.assignee_id
                FROM tasks t
                JOIN projects p ON t.project_id = p.project_id
                WHERE t.due_date = current_date + interval '1 day' AND t.status != 'Done'`;
            
            const result = await pool.query(query);
            
            for (const task of result.rows) {
                const recipientSocketId = userSockets[task.assignee_id];

                if (recipientSocketId) {
                    const notification = {
                        message: `Reminder: Your task "${task.title}" in project "${task.project_name}" is due tomorrow!`,
                        taskId: task.task_id
                    };
                    io.to(recipientSocketId).emit('deadline_reminder', notification);
                }
            }
        } catch (error) {
            console.error('Scheduler Error:', error);
        }
    });
};

module.exports = { checkDeadlines };