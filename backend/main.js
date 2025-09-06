const express = require("express");
const http = require('http');
const cors = require("cors");
const socketManager = require('./socket');
const MainRouter = require("./index.js");
const { checkDeadlines } = require('./services/scheduler.js');

const app = express();
const server = http.createServer(app);

const io = socketManager.init(server);
const userSockets = socketManager.userSockets;

app.use(cors());
app.use(express.json());
app.use("/api/v1", MainRouter);

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('register_user', (userId) => {
        userSockets[userId] = socket.id;
        console.log('Registered user:', userId, 'with socket:', socket.id);
    });

    socket.on('disconnect', () => {
        for (const userId in userSockets) {
            if (userSockets[userId] === socket.id) {
                delete userSockets[userId];
                break;
            }
        }
        console.log('User disconnected:', socket.id);
    });

    socket.on('join_project', (projectId) => {
        socket.join(projectId);
        console.log(`User ${socket.id} joined project room: ${projectId}`);
    });

    socket.on('send_message', (data) => {
        io.to(data.projectId).emit('receive_message', data);
    });
});

server.listen(3000, () => {
    console.log("Server connected on port 3000");
    checkDeadlines();
});
