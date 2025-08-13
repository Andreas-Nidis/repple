import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriends,
  removeFriend,
} from '../db/friendQueries';

export async function sendFriend(userId: string, friendId: string) {
  if (!userId) throw new Error('Unauthorized');
  if (userId === friendId) throw new Error('BadRequest');

  return await sendFriendRequest(userId, friendId);
}

export async function acceptFriend(userId: string, friendId: string) {
  if (!userId) throw new Error('Unauthorized');
  if (userId === friendId) throw new Error('BadRequest');

  return await acceptFriendRequest(userId, friendId);
}

export async function rejectFriend(userId: string, friendId: string) {
  if (!userId) throw new Error('Unauthorized');
  if (userId === friendId) throw new Error('BadRequest');

  return await rejectFriendRequest(userId, friendId);
}

export async function listFriends(userId: string) {
  if (!userId) throw new Error('Unauthorized');

  return await getFriends(userId);
}

export async function removeFriendById(userId: string, friendId: string) {
  if (!userId) throw new Error('Unauthorized');
  if (userId === friendId) throw new Error('BadRequest');

  const removed = await removeFriend(userId, friendId);
  if (!removed.length) throw new Error('NotFound');

  return removed;
}
