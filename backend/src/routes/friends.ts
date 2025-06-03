import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { sql } from '../db/db';

const router = express.Router();

router.post('/:userId', authenticateToken, async (req: Request, res: Response) => {
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

export default router;