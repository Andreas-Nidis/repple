import { Request, Response, NextFunction } from 'express';
import {
  sendFriendRequest,
  getPendingRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriends,
  removeFriend,
} from '../db/friendQueries';
import { getIO, getUserSocketId } from '../socket';

export async function sendFriendRequestController(req: Request, res: Response, next: NextFunction): Promise<void> {
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
    const existingRequest = await sendFriendRequest(userId, friendId);
    // const io = getIO();
    // const receiverSocketId = getUserSocketId(friendId.toString());

    // if (receiverSocketId) {
    //   io.to(receiverSocketId).emit('friendRequest', {
    //     from: userId,
    //     message: `You have a new friend request from ${userId}`,
    //   });
    // }

    res.status(201).json({ message: 'Friend request sent successfully', request: existingRequest });
  } catch (error) {
    next(error);
  }
}

export async function getPendingRequestsController(req: Request, res: Response, next: NextFunction): Promise<void> {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ error: 'User not authenticated' });
    return;
  }

  try {
    const pendingRequests = await getPendingRequests(userId);
    res.status(200).json(pendingRequests);
  } catch (error) {
    next(error);
  }
}

export async function acceptFriendRequestController(req: Request, res: Response, next: NextFunction): Promise<void> {
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
    const acceptedRequest = await acceptFriendRequest(userId, friendId);
    // const io = getIO();
    // const senderSocketId = getUserSocketId(friendId.toString());

    // if (senderSocketId) {
    //   io.to(senderSocketId).emit('friendRequestAccepted', {
    //     from: userId,
    //     message: `Your friend request to ${userId} has been accepted`,
    //   });
    // }

    res.status(200).json({ message: 'Friend request accepted', request: acceptedRequest });
  } catch (error) {
    next(error);
  }
}

export async function rejectFriendRequestController(req: Request, res: Response, next: NextFunction): Promise<void> {
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
    await rejectFriendRequest(userId, friendId);
    res.status(200).json({ message: 'Friend request rejected' });
  } catch (error) {
    next(error);
  }
}

export async function getFriendsController(req: Request, res: Response, next: NextFunction): Promise<void> {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ error: 'User not authenticated' });
    return;
  }

  try {
    const friends = await getFriends(userId);
    res.status(200).json(friends);
  } catch (error) {
    next(error);
  }
}

export async function removeFriendController(req: Request, res: Response, next: NextFunction): Promise<void> {
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
    const removedFriend = await removeFriend(userId, friendId);

    if (!removedFriend.length) {
      res.status(404).json({ error: 'Friend not found' });
      return;
    }

    res.status(200).json({ message: 'Friend removed successfully', friend: removedFriend });
  } catch (error) {
    next(error);
  }
}
