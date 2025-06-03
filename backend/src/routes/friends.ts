import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { sql } from '../db/db';

const router = express.Router();

router.post('/:friendId', authenticateToken, async (req: Request, res: Response) => {
    const { friendId } = req.params;
    const { user } = req;

    if (!user || user.sub === friendId) {
        res.status(400).json({ error: 'Inavlid friend request' });
        return;
    };

    try {
        // Check if the friend request already exists
        const existingRequest = await sql`
            SELECT * FROM friendships
            WHERE user_id = ${user.sub} AND friend_id = ${friendId}
        `;

        if (existingRequest.length > 0) {
            res.status(400).json({ error: 'Friend request already exists' });
            return;
        }

        // Create a new friend request
        await sql` 
            INSERT INTO friendships (user_id, friend_id, status)
            VALUES (${user.sub}, ${friendId}, 'pending')
        `;
        res.status(201).json({ message: 'Friend request sent successfully' });
    } catch (error) {
        console.error('Error sending friend request:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

router.post('/:friendId/accept', authenticateToken, async (req: Request, res: Response) => {
    const { friendId } = req.params;
    const { user } = req;

    try {
        //Update the status of the friend request to 'accepted'
        const result = await sql`
            UPDATE friendships
            SET status = 'accepted'
            WHERE user_id = ${friendId} AND friend_id = ${user.sub} AND status = 'pending'
            RETURNING *
        `;

        if (result.length === 0) {
            res.status(404).json({ error: 'No pending request found' });
            return;
        }

        res.status(200).json({ message: 'Friend request accepted successfully'});
    } catch (error) {
        res.status(500).json({ error: 'Error accepting friend request:' });
    }
});

router.get('/', authenticateToken, async (req: Request, res: Response) => {
    const { user } = req;

    try {
        // Get all friends of the user
        const friends = await sql`
            SELECT f.friend_id, u.username, u.email, u.profile_picture
            FROM friendships f
            JOIN users u ON f.friend_id = u.id
            WHERE f.user_id = ${user.sub} AND f.status = 'accepted'

            UNION

            SELECT f.user_id, u.username, u.email, u.profile_picture
            FROM friendships f
            JOIN users u ON f.user_id = u.id
            WHERE f.friend_id = ${user.sub} AND f.status = 'accepted'
        `;

        res.status(200).json(friends);
    } catch (error) {
        console.error('Error fetching friends:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

router.delete('/:friendId', authenticateToken, async (req: Request, res: Response) => {
    const { friendId } = req.params;
    const { user } = req;

    try {
        // Delete the friendship record
        const result = await sql`
            DELETE FROM friendships
            WHERE (user_id = ${user.sub} AND friend_id = ${friendId})
            OR (user_id = ${friendId} AND friend_id = ${user.sub})
            RETURNING *
        `;

        if (result.length === 0) {
            res.status(404).json({ error: 'Friendship not found' });
            return;
        }

        res.status(200).json({ message: 'Friendship deleted successfully' });
    } catch (error) {
        console.error('Error deleting friendship:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

export default router;