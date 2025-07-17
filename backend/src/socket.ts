import { Server, Socket } from 'socket.io';
import { getFriends } from './db/friendQueries';
import { getUserIdByFirebaseId } from './db/userQueries';

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
        socket.on('identify', async (firebaseId: string) => {
            const userId = await getUserIdByFirebaseId(firebaseId);
            if (!userId) {
                console.log('No user found for Firebase ID:', firebaseId);
                return;
            }
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

        socket.on('friendsActivity', async (payload) => {
            console.log('SOCKET: friencActivity activated.')
            const {firebaseId, workoutId, action} = payload;

            const userId = await getUserIdByFirebaseId(firebaseId);
            if (!userId) {
                console.log('No user found for Firebase ID:', firebaseId);
                return;
            }

            const friends = await getFriends(userId);
            console.log(friends);
            friends.forEach(friend => {
                const friendSocketId = userSocketMap.get(friend.friend_id);
                console.log(friendSocketId);
                if (friendSocketId) {
                    io.to(friendSocketId).emit('friendActivity', {
                        userId,
                        workoutId,
                        action,
                    })
                }
            });
        })
    });
    console.log('Socket.IO setup complete');
};
    
export const getUserSocketId = (userId: string) =>{
    return userSocketMap.get(userId);
}

export const getIO = () => ioInstance;