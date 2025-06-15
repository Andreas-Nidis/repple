import express, { Request, Response } from 'express';
import { authenticateFirebase } from '../middleware/authMiddleware';
import { sendFriendRequest, getPendingRequests, acceptFriendRequest, rejectFriendRequest, getFriends, removeFriend } from '../db/friendQueries';
import { getIO, getUserSocketId } from '../socket';

const router = express.Router();

// Send a friend request
router.post('/:friendId', authenticateFirebase, async (req: Request, res: Response) => {
    const { friendId } = req.params;
    const { user } = req;

    if (!user || user.uid === friendId) {
        res.status(400).json({ error: 'Invalid friend request' });
        return;
    }

    try {
        const existingRequest = await sendFriendRequest(user.uid, friendId);
        const io = getIO();
        const receiverSocketId = getUserSocketId(friendId.toString());

        if (receiverSocketId) {
            io.to(receiverSocketId).emit('friendRequest', {
                from: user.uid,
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
router.get('/pending', authenticateFirebase, async (req: Request, res: Response) => {
    const { user } = req;
    if (!user) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
    }
    if (!user.uid) {
        res.status(400).json({ error: 'Invalid user ID' });
        return;
    }

    try {
        const pendingRequests = await getPendingRequests(user.uid);
        res.status(200).json(pendingRequests);
    } catch (error) {
        console.error('Error fetching pending requests:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Accept a friend request
router.post('/accept/:friendId', authenticateFirebase, async (req: Request, res: Response) => {
    const { friendId } = req.params;
    const { user } = req;
    if (!user || user.uid === friendId) {
        res.status(400).json({ error: 'Invalid friend request acceptance' });
        return;
    }

    try {
        const acceptedRequest = await acceptFriendRequest(user.uid, friendId);

        const io = getIO();
        const senderSocketId = getUserSocketId(friendId.toString());

        if (senderSocketId) {
            io.to(senderSocketId).emit('friendRequestAccepted', {
                from: user.uid,
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
router.post('/reject/:friendId', authenticateFirebase, async (req: Request, res: Response) => {
    const { friendId } = req.params;
    const { user } = req;
    if (!user || user.uid === friendId) {
        res.status(400).json({ error: 'Invalid friend request rejection' });
        return;
    }

    try {
        await rejectFriendRequest(user.uid, friendId);
        res.status(200).json({ message: 'Friend request rejected' });
    } catch (error) {
        console.error('Error rejecting friend request:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Get friends list
router.get('/friends', authenticateFirebase, async (req: Request, res: Response) => {
    const { user } = req;
    if (!user) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
    }

    try {
        const friends = await getFriends(user.uid);
        res.status(200).json(friends);
    } catch (error) {
        console.error('Error fetching friends list:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Remove a friend
router.delete('/friends/:friendId', authenticateFirebase, async (req: Request, res: Response) => {
    const { friendId } = req.params;
    const { user } = req;
    if (!user || user.uid === friendId) {
        res.status(400).json({ error: 'Invalid friend removal' });
        return;
    }

    try {
        const removedFriend = await removeFriend(user.uid, friendId);
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