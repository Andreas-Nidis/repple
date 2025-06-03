import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { sendFriendRequest, getPendingRequests, acceptFriendRequest, rejectFriendRequest, getFriends, removeFriend } from '../db/friendQueries';
import { getIO, getUserSocketId } from '../socket';

const router = express.Router();

// Send a friend request
router.post('/:friendId', authenticateToken, async (req: Request, res: Response) => {
    const { friendId } = req.params;
    const { user } = req;

    if (!user || user.sub === friendId) {
        res.status(400).json({ error: 'Invalid friend request' });
        return;
    }

    try {
        const existingRequest = await sendFriendRequest(user.sub, friendId);
        const io = getIO();
        const receiverSocketId = getUserSocketId(friendId.toString());

        if (receiverSocketId) {
            io.to(receiverSocketId).emit('friendRequest', {
                from: user.sub,
                message: `You have a new friend request from ${user.name}`,
            });
        }
        res.status(201).json({ message: 'Friend request sent successfully', request: existingRequest });
    } catch (error) {
        console.error('Error sending friend request:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Get pending friend requests
router.get('/pending', authenticateToken, async (req: Request, res: Response) => {
    const { user } = req;

    try {
        const pendingRequests = await getPendingRequests(user.sub);
        res.status(200).json(pendingRequests);
    } catch (error) {
        console.error('Error fetching pending requests:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Accept a friend request
router.post('/accept/:friendId', authenticateToken, async (req: Request, res: Response) => {
    const { friendId } = req.params;
    const { user } = req;

    try {
        const acceptedRequest = await acceptFriendRequest(user.sub, friendId);

        const io = getIO();
        const senderSocketId = getUserSocketId(friendId.toString());

        if (senderSocketId) {
            io.to(senderSocketId).emit('friendRequestAccepted', {
                from: user.sub,
                message: `Your friend request to ${user.name} has been accepted`,
            });
        }
        
        res.status(200).json({ message: 'Friend request accepted', request: acceptedRequest });
    } catch (error) {
        console.error('Error accepting friend request:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Reject a friend request
router.post('/reject/:friendId', authenticateToken, async (req: Request, res: Response) => {
    const { friendId } = req.params;
    const { user } = req;

    try {
        await rejectFriendRequest(user.sub, friendId);
        res.status(200).json({ message: 'Friend request rejected' });
    } catch (error) {
        console.error('Error rejecting friend request:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Get friends list
router.get('/friends', authenticateToken, async (req: Request, res: Response) => {
    const { user } = req;

    try {
        const friends = await getFriends(user.sub);
        res.status(200).json(friends);
    } catch (error) {
        console.error('Error fetching friends list:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Remove a friend
router.delete('/friends/:friendId', authenticateToken, async (req: Request, res: Response) => {
    const { friendId } = req.params;
    const { user } = req;

    try {
        const removedFriend = await removeFriend(user.sub, friendId);
        if (removedFriend.length === 0) {
            res.status(404).json({ error: 'Friend not found' });
            return;
        }
        res.status(200).json({ message: 'Friend removed successfully', friend: removedFriend });
    } catch (error) {
        console.error('Error removing friend:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

export default router;