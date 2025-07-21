import { Request, Response, NextFunction } from 'express';
import {
  getWeightEntries,
  createWeightEntry,
  updateWeightEntry,
  deleteWeightEntries
} from '../db/weightQueries';

export async function getAllWeightEntries(req: Request, res: Response, next: NextFunction) {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const result = await getWeightEntries(userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function createWeightEntryHandler(req: Request, res: Response, next: NextFunction) {
  const userId = req.user?.id;
  const { entryDate, weight } = req.body;

  if (!userId || !entryDate || !weight) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    await createWeightEntry(userId, entryDate, weight);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
}

export async function updateWeightEntryHandler(req: Request, res: Response, next: NextFunction) {
  const userId = req.user?.id;
  const { entryDate } = req.params;
  const { weight } = req.body;

  if (!userId || !entryDate || !weight) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    await updateWeightEntry(userId, entryDate, weight);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
}

export async function deleteWeightEntryHandler(req: Request, res: Response, next: NextFunction) {
  const userId = req.user?.id;
  const { entryDate } = req.params;

  if (!userId || !entryDate) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    await deleteWeightEntries(userId, entryDate);
    res.status(200).json({ message: 'Weight entry deleted successfully.' });
  } catch (error) {
    next(error);
  }
}