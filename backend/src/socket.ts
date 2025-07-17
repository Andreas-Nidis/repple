import { Server, Socket } from 'socket.io';
import { getFriends } from './db/friendQueries';

const onlineUsers = new Map<string, string>();
const userSocketMap = new Map<string, string>();

let ioInstance: Server;

export const setupSocketIO = (io: Server) => {
    ioInstance = io;

    io.on('connection', (socket: Socket) => {
        console.log('Socket connected:', socket.id);

        socket.on('error', (err) => {
            console.error('Socket error:', err);
        });

        // Handle login event
        socket.on('identify', (userId: string) => {
            onlineUsers.set(socket.id, userId);
            userSocketMap.set(userId, socket.id);
            console.log(`User ${userId} is online!`);
            io.emit('userOnline', userId);
        });

        // Handle disconnect event
        socket.on('disconnect', (reason) => {
            console.log('Client disconnected:', socket.id, 'Reason:', reason);
            const userId = onlineUsers.get(socket.id);
            if(userId) {
                onlineUsers.delete(socket.id);
                userSocketMap.delete(userId);
                console.log(`User ${userId} has gone offline!`);
                io.emit('userOffline', userId);
            }
        });
    });
    console.log('Socket.IO setup complete');
};
    
export const getUserSocketId = (userId: string) =>{
    return userSocketMap.get(userId);
}

export const emitToFriends = async (userId: string, payload: any, io: any) => {
    const friends = await getFriends(userId);

    friends.forEach(friend => {
        const friendSocketId = userSocketMap.get(friend.friend_id);
        if (friendSocketId) {
            io.to(friendSocketId).emit('friendActivity', payload);
        }
    });
}

export const getIO = () => ioInstance;