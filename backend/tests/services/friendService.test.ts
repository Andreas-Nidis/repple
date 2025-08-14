// tests/services/friendService.test.ts
import * as friendDb from '../../src/db/friendQueries';
import * as friendService from '../../src/services/friendService';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

jest.mock('../../src/db/friendQueries');

describe('friendService', () => {
  const userId = 'user1';
  const friendId = 'user2';
  const result = [{ success: true }];

  let mockSendFriendRequest: jest.MockedFunction<typeof friendDb.sendFriendRequest>;
  let mockAcceptFriendRequest: jest.MockedFunction<typeof friendDb.acceptFriendRequest>;
  let mockRejectFriendRequest: jest.MockedFunction<typeof friendDb.rejectFriendRequest>;
  let mockGetFriends: jest.MockedFunction<typeof friendDb.getFriends>;
  let mockRemoveFriend: jest.MockedFunction<typeof friendDb.removeFriend>;

  beforeEach(() => {
    mockSendFriendRequest = friendDb.sendFriendRequest as jest.MockedFunction<typeof friendDb.sendFriendRequest>;
    mockAcceptFriendRequest = friendDb.acceptFriendRequest as jest.MockedFunction<typeof friendDb.acceptFriendRequest>;
    mockRejectFriendRequest = friendDb.rejectFriendRequest as jest.MockedFunction<typeof friendDb.rejectFriendRequest>;
    mockGetFriends = friendDb.getFriends as jest.MockedFunction<typeof friendDb.getFriends>;
    mockRemoveFriend = friendDb.removeFriend as jest.MockedFunction<typeof friendDb.removeFriend>;

    jest.resetAllMocks();
  });

  describe('sendFriend', () => {
    it('throws Unauthorized if no userId', async () => {
      await expect(friendService.sendFriend('', friendId)).rejects.toThrow('Unauthorized');
    });

    it('throws BadRequest if sending request to self', async () => {
      await expect(friendService.sendFriend(userId, userId)).rejects.toThrow('BadRequest');
    });

    it('calls DB and returns result', async () => {
      mockSendFriendRequest.mockResolvedValue(result);

      const res = await friendService.sendFriend(userId, friendId);

      expect(mockSendFriendRequest).toHaveBeenCalledWith(userId, friendId);
      expect(res).toEqual(result);
    });
  });

  describe('acceptFriend', () => {
    it('throws Unauthorized if no userId', async () => {
      await expect(friendService.acceptFriend('', friendId)).rejects.toThrow('Unauthorized');
    });

    it('throws BadRequest if accepting self', async () => {
      await expect(friendService.acceptFriend(userId, userId)).rejects.toThrow('BadRequest');
    });

    it('calls DB and returns result', async () => {
      mockAcceptFriendRequest.mockResolvedValue(undefined);

      const res = await friendService.acceptFriend(userId, friendId);

      expect(mockAcceptFriendRequest).toHaveBeenCalledWith(userId, friendId);
    });
  });

  describe('rejectFriend', () => {
    it('throws Unauthorized if no userId', async () => {
      await expect(friendService.rejectFriend('', friendId)).rejects.toThrow('Unauthorized');
    });

    it('throws BadRequest if rejecting self', async () => {
      await expect(friendService.rejectFriend(userId, userId)).rejects.toThrow('BadRequest');
    });

    it('calls DB and returns result', async () => {
      mockRejectFriendRequest.mockResolvedValue(result);

      const res = await friendService.rejectFriend(userId, friendId);

      expect(mockRejectFriendRequest).toHaveBeenCalledWith(userId, friendId);
      expect(res).toEqual(result);
    });
  });

  describe('listFriends', () => {
    it('throws Unauthorized if no userId', async () => {
      await expect(friendService.listFriends('')).rejects.toThrow('Unauthorized');
    });

    it('returns friends from DB', async () => {
      const mockFriends = [{ id: 'user2', name: 'Alice' }];
      mockGetFriends.mockResolvedValue(mockFriends);

      const res = await friendService.listFriends(userId);

      expect(mockGetFriends).toHaveBeenCalledWith(userId);
      expect(res).toEqual(mockFriends);
    });
  });

  describe('removeFriendById', () => {
    it('throws Unauthorized if no userId', async () => {
      await expect(friendService.removeFriendById('', friendId)).rejects.toThrow('Unauthorized');
    });

    it('throws BadRequest if removing self', async () => {
      await expect(friendService.removeFriendById(userId, userId)).rejects.toThrow('BadRequest');
    });

    it('throws NotFound if DB returns empty array', async () => {
      mockRemoveFriend.mockResolvedValue([]);

      await expect(friendService.removeFriendById(userId, friendId)).rejects.toThrow('NotFound');
    });

    it('returns removed friend if successful', async () => {
      const removed = [{ id: friendId, name: 'Alice' }];
      mockRemoveFriend.mockResolvedValue(removed);

      const res = await friendService.removeFriendById(userId, friendId);

      expect(mockRemoveFriend).toHaveBeenCalledWith(userId, friendId);
      expect(res).toEqual(removed);
    });
  });
});
