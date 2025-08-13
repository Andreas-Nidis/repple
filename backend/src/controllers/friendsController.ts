import { Request, Response, NextFunction } from 'express';
import * as friendService from '../services/friendService';

export async function sendFriendRequestController(req: Request, res: Response, next: NextFunction) {
    try {
        const request = await friendService.sendFriend(req.user?.id!, req.params.friendId);
        res.status(201).json({ message: 'Friend request sent successfully', request });
    } catch (error) {
        next(error);
    }
}

export async function acceptFriendRequestController(req: Request, res: Response, next: NextFunction) {
    try {
        const accepted = await friendService.acceptFriend(req.user?.id!, req.params.friendId);
        res.status(200).json({ message: 'Friend request accepted', request: accepted });
    } catch (error) {
        next(error);
    }
}

export async function rejectFriendRequestController(req: Request, res: Response, next: NextFunction) {
    try {
        await friendService.rejectFriend(req.user?.id!, req.params.friendId);
        res.status(200).json({ message: 'Friend request rejected' });
    } catch (error) {
        next(error);
    }
}

export async function getFriendsController(req: Request, res: Response, next: NextFunction) {
    try {
        const friends = await friendService.listFriends(req.user?.id!);
        res.status(200).json(friends);
    } catch (error) {
        next(error);
    }
}

export async function removeFriendController(req: Request, res: Response, next: NextFunction) {
    try {
        const removed = await friendService.removeFriendById(req.user?.id!, req.params.friendId);
        res.status(200).json({ message: 'Friend removed successfully', friend: removed });
    } catch (error) {
        next(error);
    }
}
