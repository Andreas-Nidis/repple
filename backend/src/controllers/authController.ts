import { Request, Response, NextFunction } from 'express';
import { findUser } from '../db/userQueries';

export async function getCurrentUserController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    res.json({ user: req.user });
  } catch (error) {
    next(error);
  }
}

export async function loginController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { uid, email, name, picture } = req.user;

    if (!uid || !email) {
      res.status(400).json({ error: 'Invalid Firebase user data' });
      return;
    }

    const user = await findUser(
      uid as string,
    );

    res.json({ user });
  } catch (error) {
    next(error);
  }
}
