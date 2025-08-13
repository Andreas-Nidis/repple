import { Request, Response, NextFunction } from 'express';
import * as calendarService from '../services/calendarService';

export async function getEntriesForWeekController(req: Request, res: Response, next: NextFunction) {
  try {
    const { startDate, endDate } = req.query;
    const entries = await calendarService.listEntriesForWeek(req.user?.id!, String(startDate), String(endDate));
    res.status(200).json(entries);
  } catch (error) {
    next(error);
  }
}

export async function createCalendarEntryController(req: Request, res: Response, next: NextFunction) {
  try {
    const { workout_id, scheduled_date } = req.body;
    const entry = await calendarService.createNewCalendarEntry(req.user?.id!, workout_id, scheduled_date);
    res.status(201).json(entry);
  } catch (error) {
    next(error);
  }
}

export async function toggleCompletionController(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const updated = await calendarService.toggleCalendarEntryCompletion(req.user?.id!, id);
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
}

export async function deleteCalendarEntryController(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const deleted = await calendarService.deleteCalendarEntryById(req.user?.id!, id);
    res.status(200).json(deleted);
  } catch (error) {
    next(error);
  }
}
