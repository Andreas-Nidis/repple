import { Request, Response, NextFunction } from 'express';
import { 
    getUsers,
} from '../db/userQueries';

export async function getUsersHandler(req: Request, res: Response, next: NextFunction) {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const result = await getUsers(userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
}