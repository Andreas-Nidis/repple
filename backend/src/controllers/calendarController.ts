import { Request, Response, NextFunction } from 'express';
import {
  getEntriesForWeek,
  createCalendarEntry,
  toggleCompletion,
  deleteCalendarEntry,
} from '../db/calendarQueries';

export async function getEntriesForWeekController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user?.id;
    const { startDate, endDate } = req.query;

    const entries = await getEntriesForWeek(userId, String(startDate), String(endDate));

    res.json(entries);
  } catch (error) {
    next(error);
  }
}

export async function createCalendarEntryController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user?.id;
    const { workout_id, scheduled_date } = req.body;

    const entry = await createCalendarEntry(userId, workout_id, scheduled_date);

    res.status(201).json(entry);
  } catch (error) {
    next(error);
  }
}

export async function toggleCompletionController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const updated = await toggleCompletion(userId, id);

    res.json(updated);
  } catch (error) {
    next(error);
  }
}

export async function deleteCalendarEntryController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const deleted = await deleteCalendarEntry(userId, id);

    res.json(deleted);
  } catch (error) {
    next(error);
  }
}
