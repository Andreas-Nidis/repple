import { listUsers } from '../../src/services/userService';
import * as userDb from '../../src/db/userQueries';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

jest.mock('../../src/db/userQueries');

describe('listUsers', () => {
  let mockGetUsers: jest.MockedFunction<typeof userDb.getUsers>;

  beforeEach(() => {
    mockGetUsers = userDb.getUsers as jest.MockedFunction<typeof userDb.getUsers>;

    jest.resetAllMocks();
  });

  it('should throw Unauthorized if no userId is provided', async () => {
    await expect(listUsers('')).rejects.toThrow('Unauthorized');
  });

  it('should return users from the database', async () => {
    const fakeUsers = [{ id: 'u1', name: 'Alice' }];
    mockGetUsers.mockResolvedValue(fakeUsers);

    const result = await listUsers('user-123');

    expect(mockGetUsers).toHaveBeenCalledWith('user-123');
    expect(result).toEqual(fakeUsers);
  });

  it('should throw if database call fails', async () => {
    mockGetUsers.mockRejectedValue(new Error('DB error'));

    await expect(listUsers('user-123')).rejects.toThrow('DB error');
  });
});
