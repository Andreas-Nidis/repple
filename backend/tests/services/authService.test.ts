// tests/services/authService.test.ts
import { getCurrentUser, loginUser } from '../../src/services/authService';
import { findUser, User } from '../../src/db/userQueries';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

jest.mock('../../src/db/userQueries', () => ({
  findUser: jest.fn(),
}));

describe('authService', () => {
  let mockUser: any;

  beforeEach(() => {
    mockUser = {
      uid: '123',
      email: 'test@example.com',
      name: 'Test User',
      picture: 'http://example.com/pic.jpg',
    };
    (findUser as jest.Mock).mockReset();
  });

  describe('getCurrentUser', () => {
    it('should return the user if provided', () => {
      const result = getCurrentUser(mockUser);
      expect(result).toBe(mockUser);
    });

    it('should throw Unauthorized if no user is provided', () => {
      expect(() => getCurrentUser(null)).toThrow('Unauthorized');
    });
  });

  describe('loginUser', () => {
    it('should throw Unauthorized if no user is provided', async () => {
      await expect(loginUser(null)).rejects.toThrow('Unauthorized');
    });

    it('should throw BadRequest if uid is missing', async () => {
      mockUser.uid = null;
      await expect(loginUser(mockUser)).rejects.toThrow('BadRequest');
    });

    it('should throw BadRequest if email is missing', async () => {
      mockUser.email = null;
      await expect(loginUser(mockUser)).rejects.toThrow('BadRequest');
    });

    it('should return the found user from the database', async () => {
      const dbUser: User = {
        id: 'db-user-id',
        uid: '123',
        email: 'test@example.com',
        name: 'Test User',
        picture: 'http://example.com/pic.jpg',
        friend_code: '456',
      };
      (findUser as jest.MockedFunction<typeof findUser>).mockResolvedValue(dbUser);

      const result = await loginUser(mockUser);
      expect(findUser).toHaveBeenCalledWith('123');
      expect(result).toBe(dbUser);
    });

    it('should propagate errors from findUser', async () => {
      (findUser as jest.MockedFunction<typeof findUser>).mockRejectedValue(new Error('DB Error'));

      await expect(loginUser(mockUser)).rejects.toThrow('DB Error');
    });
  });
});
