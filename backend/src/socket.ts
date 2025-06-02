import { Server, Socket } from 'socket.io';

const onlineUsers = new Map<string, string>();

export const setupSocketIO = (io: Server) => {
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
    