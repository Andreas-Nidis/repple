import { authenticateFirebase, AuthenticatedRequest } from '../../src/middleware/authMiddleware';
import admin from '../../src/utils/firebaseAdmin';
// import { sql } from '../../src/db/db';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../src/utils/firebaseAdmin', () => ({
  __esModule: true,
  default: {
    auth: jest.fn(),
  },
}));

jest.mock('../../src/db/db');

const mockNext = jest.fn();

const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

const mockRequest = (authHeader?: string): AuthenticatedRequest => ({
  headers: {
    authorization: authHeader,
  },
  user: undefined,
  // Provide minimal `get` method to satisfy Express.Request if needed
  get: (name: string) => {
    if (name.toLowerCase() === 'authorization') return authHeader;
    return undefined;
  },
} as unknown as AuthenticatedRequest);


//Test
describe('authenticateFirebase middleware', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns 401 if no authorization header', async () => {
        const req = mockRequest();
        const res = mockResponse();

        await authenticateFirebase(req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'No token provided' });
        expect(mockNext).not.toHaveBeenCalled();
    });

    it('returns 401 if authorization header does not start with Bearer', async () => {
        const req = mockRequest('Dummy 123');
        const res = mockResponse();

        await authenticateFirebase(req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'No token provided' });
        expect(mockNext).not.toHaveBeenCalled();
    });

    it('returns 401 if Firebase token verification fails', async () => {
        const req = mockRequest('Bearer invalid-token');
        const res = mockResponse();

        const mockVerify = jest.fn((token: string) => Promise.reject(new Error('invalid token')));

        (admin.auth as jest.Mock).mockReturnValue({
            verifyIdToken: mockVerify,
        });

        await authenticateFirebase(req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid Firebase token' });
        expect(mockNext).not.toHaveBeenCalled();
    });
})