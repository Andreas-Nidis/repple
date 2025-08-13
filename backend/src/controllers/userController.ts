import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/userService';

export async function getUsersHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await userService.listUsers(req.user?.id!);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
}
