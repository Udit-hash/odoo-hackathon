const { Server } = require("socket.io");

let io;
const userSockets = {}; // A map to store { userId: socketId }

module.exports = {
    init: (httpServer) => {
        io = new Server(httpServer, {
            cors: {
                origin: "*", // Adjust for your frontend URL in production
                methods: ["GET", "POST"]
            }
        });
        return io;
    },
    getIO: () => {
        if (!io) {
            throw new Error("Socket.io not initialized!");
        }
        return io;
    },
    userSockets
};