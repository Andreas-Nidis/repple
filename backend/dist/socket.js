"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocketIO = void 0;
const onlineUsers = new Map();
const setupSocketIO = (io) => {
    io.on('connection', (socket) => {
        console.log('Socket connected:', socket.id);
        // Handle login event
        socket.on('identify', (userId) => {
            onlineUsers.set(socket.id, userId);
            console.log(`User ${userId} is online!`);
            io.emit('userOnline', userId);
        });
        // Handle disconnect event
        socket.on('disconnect', () => {
            for (const [id, userId] of onlineUsers.entries()) {
                if (id === socket.id) {
                    onlineUsers.delete(userId);
                    console.log(`User ${userId} has gone offline!`);
                    io.emit('userOffline', userId);
                    break;
                }
            }
        });
    });
    console.log('Socket.IO setup complete');
};
exports.setupSocketIO = setupSocketIO;
