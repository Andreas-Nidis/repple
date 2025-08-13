import {
  getEntriesForWeek,
  createCalendarEntry,
  toggleCompletion,
  deleteCalendarEntry,
} from '../db/calendarQueries';

export async function listEntriesForWeek(userId: string, startDate: string, endDate: string) {
  if (!userId) throw new Error('Unauthorized');
  return await getEntriesForWeek(userId, startDate, endDate);
}

export async function createNewCalendarEntry(userId: string, workout_id: string, scheduled_date: string) {
  if (!userId) throw new Error('Unauthorized');
  if (!workout_id || !scheduled_date) throw new Error('BadRequest');
  return await createCalendarEntry(userId, workout_id, scheduled_date);
}

export async function toggleCalendarEntryCompletion(userId: string, entryId: string) {
  if (!userId) throw new Error('Unauthorized');
  const updated = await toggleCompletion(userId, entryId);
  if (!updated) throw new Error('NotFound');
  return updated;
}

export async function deleteCalendarEntryById(userId: string, entryId: string) {
  if (!userId) throw new Error('Unauthorized');
  const deleted = await deleteCalendarEntry(userId, entryId);
  if (!deleted) throw new Error('NotFound');
  return deleted;
}
