import { sql } from './db';

export async function sendFriendRequest(userId: string, friendId: string) {
    return await sql`
        INSERT INTO friendships (user_id, friend_id, status)
        VALUES (${userId}, ${friendId}, 'pending')
        RETURNING *
    `;
}

export async function getPendingRequests(userId: string) {
    return await sql`
        SELECT * FROM friendships
        WHERE friend_id = ${userId} AND status = 'pending'
    `;
}

export async function acceptFriendRequest(userId: string, friendId: string) {
    await sql`
        INSERT INTO friendships (user_id, friend_id, status)
        VALUES
            (${friendId}, ${userId}, 'accepted'),
            (${userId}, ${friendId}, 'accepted')
        ON CONFLICT (user_id, friend_id) DO UPDATE
        SET status = 'accepted';
    `;
}

export async function rejectFriendRequest(userId: string, friendId: string) {
    return await sql`
        DELETE FROM friendships
        WHERE user_id = ${friendId} AND friend_id = ${userId} AND status = 'pending'
    `;
}

export async function getFriends(userId: string) {
    return await sql`
        SELECT f.friend_id, u.name, u.picture
        FROM friendships f
        JOIN users u ON f.friend_id = u.id
        WHERE f.user_id = ${userId} AND f.status = 'accepted'
    `;
}

export async function removeFriend(userId: string, friendId: string) {
    return await sql`
        DELETE FROM friendships
        WHERE (user_id = ${userId} AND friend_id = ${friendId})
        OR (user_id = ${friendId} AND friend_id = ${userId})
        RETURNING *
    `;
}