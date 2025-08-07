"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.setupSocketIO = exports.getUserSocketId = void 0;
const friendQueries_1 = require("./db/friendQueries");
const userQueries_1 = require("./db/userQueries");
const onlineUsers = new Map();
const userSocketMap = new Map();
let ioInstance;
const getUserSocketId = (userId) => {
    return userSocketMap.get(userId);
};
exports.getUserSocketId = getUserSocketId;
const setupSocketIO = (io) => {
    ioInstance = io;
    const notifyUserStatus = (userId, status) => {
        io.emit("updateUserStatus", { userId, status });
        console.log(`User ${userId} is now ${status}`);
    };
    io.on('connection', (socket) => {
        console.log('Socket connected:', socket.id);
        socket.on('error', (err) => {
            console.error('Socket error:', err);
        });
        // Handle login event
        socket.on('identify', async (firebaseId) => {
            const userId = await (0, userQueries_1.getUserIdByFirebaseId)(firebaseId);
            if (!userId) {
                console.log('No user found for Firebase ID:', firebaseId);
                return;
            }
            onlineUsers.set(socket.id, userId);
            userSocketMap.set(userId, socket.id);
            // Send the list of currently online users to THIS socket only
            socket.emit('onlineUsers', Array.from(userSocketMap.keys()));
            notifyUserStatus(userId, 'online');
        });
        // Handle disconnect event
        socket.on('disconnect', (reason) => {
            console.log('Client disconnected:', socket.id, 'Reason:', reason);
            const userId = onlineUsers.get(socket.id);
            if (!userId)
                return;
            onlineUsers.delete(socket.id);
            userSocketMap.delete(userId);
            notifyUserStatus(userId, 'offline');
        });
        socket.on('friendsActivity', async (payload) => {
            const { firebaseId, workoutId, action } = payload;
            const userId = await (0, userQueries_1.getUserIdByFirebaseId)(firebaseId);
            if (!userId) {
                console.log('No user found for Firebase ID:', firebaseId);
                return;
            }
            const user = await (0, userQueries_1.getUser)(userId);
            const friends = await (0, friendQueries_1.getFriends)(userId);
            friends.forEach(friend => {
                const friendSocketId = userSocketMap.get(friend.friend_id);
                console.log(friendSocketId);
                if (friendSocketId) {
                    io.to(friendSocketId).emit('friendActivity', {
                        user,
                        workoutId,
                        action,
                    });
                }
            });
        });
        socket.on('friendRequest', async (payload) => {
            const { userId, friendId } = payload;
            const user = await (0, userQueries_1.getUser)(userId);
            const friendSocketId = userSocketMap.get(friendId);
            if (friendSocketId) {
                io.to(friendSocketId).emit('friendRequest', {
                    user,
                });
            }
        });
        socket.on('acceptFriendRequest', async (payload) => {
            const { userId, friendId } = payload;
            const user = await (0, userQueries_1.getUser)(userId);
            const friendSocketId = userSocketMap.get(friendId);
            if (friendSocketId) {
                io.to(friendSocketId).emit('acceptFriendRequest', {
                    user,
                });
            }
        });
    });
    console.log('Socket.IO setup complete');
};
exports.setupSocketIO = setupSocketIO;
const getIO = () => ioInstance;
exports.getIO = getIO;
