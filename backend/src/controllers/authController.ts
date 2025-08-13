import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';

export async function getCurrentUserController(req: Request, res: Response, next: NextFunction) {
  try {
    const currentUser = authService.getCurrentUser(req.user);
    res.status(200).json({ user: currentUser });
  } catch (error) {
    next(error);
  }
}

export async function loginController(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await authService.loginUser(req.user);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
}
