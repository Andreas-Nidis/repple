"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendFriendRequest = sendFriendRequest;
exports.acceptFriendRequest = acceptFriendRequest;
exports.rejectFriendRequest = rejectFriendRequest;
exports.getFriends = getFriends;
exports.removeFriend = removeFriend;
const db_1 = require("./db");
async function sendFriendRequest(userId, friendId) {
    return await (0, db_1.sql) `
        INSERT INTO friendships (user_id, friend_id, status)
        VALUES (${userId}, ${friendId}, 'pending')
        RETURNING *
    `;
}
async function acceptFriendRequest(userId, friendId) {
    await (0, db_1.sql) `
        INSERT INTO friendships (user_id, friend_id, status)
        VALUES
            (${friendId}, ${userId}, 'accepted'),
            (${userId}, ${friendId}, 'accepted')
        ON CONFLICT (user_id, friend_id) DO UPDATE
        SET status = 'accepted';
    `;
}
async function rejectFriendRequest(userId, friendId) {
    return await (0, db_1.sql) `
        DELETE FROM friendships
        WHERE user_id = ${friendId} AND friend_id = ${userId} AND status = 'pending'
    `;
}
async function getFriends(userId) {
    return await (0, db_1.sql) `
        SELECT f.friend_id, u.name, u.picture
        FROM friendships f
        JOIN users u ON f.friend_id = u.id
        WHERE f.user_id = ${userId} AND f.status = 'accepted'
    `;
}
async function removeFriend(userId, friendId) {
    return await (0, db_1.sql) `
        DELETE FROM friendships
        WHERE (user_id = ${userId} AND friend_id = ${friendId})
        OR (user_id = ${friendId} AND friend_id = ${userId})
        RETURNING *
    `;
}
