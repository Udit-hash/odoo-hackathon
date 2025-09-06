const express = require("express");
const http = require('http');
const cors = require("cors");
const socketManager = require('./socket'); // Import the new socket manager
const MainRouter = require("./index.js");
const { checkDeadlines } = require('./services/scheduler.js');

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO using the manager
const io = socketManager.init(server);
const userSockets = socketManager.userSockets;

app.use(cors());
app.use(express.json());
app.use("/api/v1", MainRouter);

// --- Central Socket.IO Connection Logic ---
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // When a frontend user logs in, they send their user_id to register
    socket.on('register_user', (userId) => {
        userSockets[userId] = socket.id;
        console.log('Registered user:', userId, 'with socket:', socket.id);
    });

    // When a user disconnects, remove them from our map
    socket.on('disconnect', () => {
        for (const userId in userSockets) {
            if (userSockets[userId] === socket.id) {
                delete userSockets[userId];
                break;
            }
        }
        console.log('User disconnected:', socket.id);
    });

    // Handles project-specific chat rooms
    socket.on('join_project', (projectId) => {
        socket.join(projectId);
        console.log(`User ${socket.id} joined project room: ${projectId}`);
    });

    socket.on('send_message', (data) => {
        // Broadcasts the message ONLY to people in that specific project room
        io.to(data.projectId).emit('receive_message', data);
    });
});
// ------------------------------------------

server.listen(3000, () => {
    console.log("Server connected on port 3000");
    checkDeadlines(); // Start the deadline checker
});