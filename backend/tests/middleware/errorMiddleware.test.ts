// tests/middleware/errorHandler.test.ts
import { errorHandler } from '../../src/middleware/errorMiddleware';
import { Request, Response, NextFunction } from 'express';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';


describe('errorHandler middleware', () => {
  let req: Partial<Request>;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = {} as Request;

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as Response;

    next = jest.fn();
  });

  it('returns 401 for Unauthorized errors', () => {
    const err = new Error('Unauthorized');

    errorHandler(err, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
  });

  it('returns 400 for BadRequest errors', () => {
    const err = new Error('BadRequest');

    errorHandler(err, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid data' });
  });

  it('returns 404 for NotFound errors', () => {
    const err = new Error('NotFound');

    errorHandler(err, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Data not found' });
  });

  it('returns 500 for any other errors', () => {
    const err = new Error('SomeOtherError');

    errorHandler(err, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Server error' });
  });
});
