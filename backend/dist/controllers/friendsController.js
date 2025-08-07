"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendFriendRequestController = sendFriendRequestController;
exports.acceptFriendRequestController = acceptFriendRequestController;
exports.rejectFriendRequestController = rejectFriendRequestController;
exports.getFriendsController = getFriendsController;
exports.removeFriendController = removeFriendController;
const friendQueries_1 = require("../db/friendQueries");
async function sendFriendRequestController(req, res, next) {
    const { friendId } = req.params;
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
    }
    if (userId === friendId) {
        res.status(400).json({ error: 'Invalid friend request' });
        return;
    }
    try {
        const existingRequest = await (0, friendQueries_1.sendFriendRequest)(userId, friendId);
        res.status(201).json({ message: 'Friend request sent successfully', request: existingRequest });
    }
    catch (error) {
        next(error);
    }
}
async function acceptFriendRequestController(req, res, next) {
    const { friendId } = req.params;
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
    }
    if (userId === friendId) {
        res.status(400).json({ error: 'Invalid friend request acceptance' });
        return;
    }
    try {
        const acceptedRequest = await (0, friendQueries_1.acceptFriendRequest)(userId, friendId);
        res.status(200).json({ message: 'Friend request accepted', request: acceptedRequest });
    }
    catch (error) {
        next(error);
    }
}
async function rejectFriendRequestController(req, res, next) {
    const { friendId } = req.params;
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
    }
    if (userId === friendId) {
        res.status(400).json({ error: 'Invalid friend request rejection' });
        return;
    }
    try {
        await (0, friendQueries_1.rejectFriendRequest)(userId, friendId);
        res.status(200).json({ message: 'Friend request rejected' });
    }
    catch (error) {
        next(error);
    }
}
async function getFriendsController(req, res, next) {
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
    }
    try {
        const friends = await (0, friendQueries_1.getFriends)(userId);
        res.status(200).json(friends);
    }
    catch (error) {
        next(error);
    }
}
async function removeFriendController(req, res, next) {
    const { friendId } = req.params;
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
    }
    if (userId === friendId) {
        res.status(400).json({ error: 'Invalid friend removal' });
        return;
    }
    try {
        const removedFriend = await (0, friendQueries_1.removeFriend)(userId, friendId);
        if (!removedFriend.length) {
            res.status(404).json({ error: 'Friend not found' });
            return;
        }
        res.status(200).json({ message: 'Friend removed successfully', friend: removedFriend });
    }
    catch (error) {
        next(error);
    }
}
