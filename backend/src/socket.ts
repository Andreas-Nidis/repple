import { Server, Socket } from 'socket.io';
import { getFriends } from './db/friendQueries';
import { getUserIdByFirebaseId, getUser } from './db/userQueries';

const onlineUsers = new Map<string, string>();
const userSocketMap = new Map<string, string>();

let ioInstance: Server;

export const getUserSocketId = (userId: string) =>{
    return userSocketMap.get(userId);
}

export const setupSocketIO = (io: Server) => {
    ioInstance = io;

    const notifyUserStatus = (userId: string, status: 'online' | 'offline') => {
        io.emit("updateUserStatus", { userId, status });
        console.log(`User ${userId} is now ${status}`);
    };

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

             // Send the list of currently online users to THIS socket only
            socket.emit('onlineUsers', Array.from(userSocketMap.keys()));

            notifyUserStatus(userId, 'online');
        });

        // Handle disconnect event
        socket.on('disconnect', (reason) => {
            console.log('Client disconnected:', socket.id, 'Reason:', reason);
            const userId = onlineUsers.get(socket.id);
            if (!userId) return;

            onlineUsers.delete(socket.id);
            userSocketMap.delete(userId);

            notifyUserStatus(userId, 'offline');
        });

        socket.on('friendsActivity', async (payload) => {
            const {firebaseId, workoutId, action} = payload;

            const userId = await getUserIdByFirebaseId(firebaseId);
            if (!userId) {
                console.log('No user found for Firebase ID:', firebaseId);
                return;
            }
            const user = await getUser(userId);
            const friends = await getFriends(userId);
            friends.forEach(friend => {
                const friendSocketId = userSocketMap.get(friend.friend_id);
                console.log(friendSocketId);
                if (friendSocketId) {
                    io.to(friendSocketId).emit('friendActivity', {
                        user,
                        workoutId,
                        action,
                    })
                }
            });
        })

        socket.on('friendRequest', async (payload) => {
            const {userId, friendId} = payload;
            const user = await getUser(userId);
            const friendSocketId = userSocketMap.get(friendId);
            if (friendSocketId) {
                io.to(friendSocketId).emit('friendRequest', {
                    user,
                })
            }
        })

        socket.on('acceptFriendRequest', async (payload) => {
            const {userId, friendId} = payload;
            const user = await getUser(userId);
            const friendSocketId = userSocketMap.get(friendId);
            if (friendSocketId) {
                io.to(friendSocketId).emit('acceptFriendRequest', {
                    user,
                })
            }
        })
    });
    console.log('Socket.IO setup complete');
};
    


export const getIO = () => ioInstance;