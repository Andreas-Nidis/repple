import { NextFunction } from 'express';
import { loginController } from '../../src/controllers/authController';
import { findUser, User } from '../../src/db/userQueries';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../src/db/userQueries', () => ({
    findUser: jest.fn()
}));

describe('loginController', () => {
    let req: any;
    let res: any;
    let next: jest.Mock
    let mockedFindUser: jest.MockedFunction<(uid: string) => Promise<User | undefined>>;

    beforeEach(() => {
        req = {
            user: {
                uid: '123',
                email: 'test@example.com',
                name: 'Test User',
                picture: 'http://example.com/pic.jpg'
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        next = jest.fn<(err?: any) => void>();

        mockedFindUser = findUser as jest.MockedFunction<(uid: string) => Promise<User | undefined>>;

    });

    it('should return user if authenticated and valid', async () => {
        (findUser as jest.MockedFunction<typeof findUser>).mockResolvedValue({
            id: 'db-user-id',
            uid: '123',
            email: 'test@example.com',
            name: 'Test User',
            picture: 'http://example.com/pic.jpg',
            friend_code: '456'
        });

        await loginController(req, res, next);

        expect(findUser).toHaveBeenCalledWith('123');

        expect(res.json).toHaveBeenCalledWith({
            user: {
                id: 'db-user-id',
                uid: '123',
                email: 'test@example.com',
                name: 'Test User',
                picture: 'http://example.com/pic.jpg'
            }
        });
    });

    it('should return 401 if req.user is missing', async () => {
        req.user = null;

        await loginController(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'User not authenticated' })
    });

    it('should return 400 if uid is missing', async () => {
        req.user.uid = null;

        await loginController(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid Firebase user data' })
    });

    it('should return 400 if email is missing', async () => {
        req.user.email = null;

        await loginController(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid Firebase user data' })
    });

    it('should call next with error on exception', async () => {
        mockedFindUser.mockRejectedValue(new Error('DB Error'));

        await loginController(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(Error));

    })
})