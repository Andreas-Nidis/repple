import { Server, Socket } from 'socket.io';

const onlineUsers = new Map<string, string>();
const userSocketMap = new Map<string, string>();

let ioInstance: Server;

export const setupSocketIO = (io: Server) => {
    ioInstance = io;

    io.on('connection', (socket: Socket) => {
        console.log('Socket connected:', socket.id);

        // Handle login event
        socket.on('identify', (userId: string) => {
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
    
export const getUserSocketId = (userId: string) =>{
    return userSocketMap.get(userId);
}

export const getIO = () => ioInstance;