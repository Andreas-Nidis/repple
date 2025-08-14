// tests/services/calendarService.test.ts
import * as calendarDb from '../../src/db/calendarQueries';
import * as calendarService from '../../src/services/calendarService';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

jest.mock('../../src/db/calendarQueries');

describe('calendarService', () => {
  const userId = 'user1';
  const entryId = 'entry1';
  const workoutId = 'workout1';
  const startDate = '2025-08-10';
  const endDate = '2025-08-16';
  const scheduledDate = '2025-08-12';
  const mockEntry = { id: entryId, workout_id: workoutId, scheduled_date: scheduledDate };

  let mockGetEntriesForWeek: jest.MockedFunction<typeof calendarDb.getEntriesForWeek>;
  let mockCreateCalendarEntry: jest.MockedFunction<typeof calendarDb.createCalendarEntry>;
  let mockToggleCompletion: jest.MockedFunction<typeof calendarDb.toggleCompletion>;
  let mockDeleteCalendarEntry: jest.MockedFunction<typeof calendarDb.deleteCalendarEntry>;

  beforeEach(() => {
    mockGetEntriesForWeek = calendarDb.getEntriesForWeek as jest.MockedFunction<typeof calendarDb.getEntriesForWeek>;
    mockCreateCalendarEntry = calendarDb.createCalendarEntry as jest.MockedFunction<typeof calendarDb.createCalendarEntry>;
    mockToggleCompletion = calendarDb.toggleCompletion as jest.MockedFunction<typeof calendarDb.toggleCompletion>;
    mockDeleteCalendarEntry = calendarDb.deleteCalendarEntry as jest.MockedFunction<typeof calendarDb.deleteCalendarEntry>;

    jest.resetAllMocks();
  });

  describe('listEntriesForWeek', () => {
    it('throws Unauthorized if no userId', async () => {
      await expect(calendarService.listEntriesForWeek('', startDate, endDate)).rejects.toThrow('Unauthorized');
    });

    it('returns entries from DB', async () => {
      mockGetEntriesForWeek.mockResolvedValue([mockEntry]);

      const result = await calendarService.listEntriesForWeek(userId, startDate, endDate);

      expect(mockGetEntriesForWeek).toHaveBeenCalledWith(userId, startDate, endDate);
      expect(result).toEqual([mockEntry]);
    });
  });

  describe('createNewCalendarEntry', () => {
    it('throws Unauthorized if no userId', async () => {
      await expect(calendarService.createNewCalendarEntry('', workoutId, scheduledDate)).rejects.toThrow('Unauthorized');
    });

    it('throws BadRequest if workout_id or scheduled_date missing', async () => {
      await expect(calendarService.createNewCalendarEntry(userId, '', scheduledDate)).rejects.toThrow('BadRequest');
      await expect(calendarService.createNewCalendarEntry(userId, workoutId, '')).rejects.toThrow('BadRequest');
    });

    it('creates a new entry and returns it', async () => {
      mockCreateCalendarEntry.mockResolvedValue(mockEntry);

      const result = await calendarService.createNewCalendarEntry(userId, workoutId, scheduledDate);

      expect(mockCreateCalendarEntry).toHaveBeenCalledWith(userId, workoutId, scheduledDate);
      expect(result).toEqual(mockEntry);
    });
  });

  describe('toggleCalendarEntryCompletion', () => {
    it('throws Unauthorized if no userId', async () => {
      await expect(calendarService.toggleCalendarEntryCompletion('', entryId)).rejects.toThrow('Unauthorized');
    });

    it('throws NotFound if DB returns null', async () => {
      mockToggleCompletion.mockResolvedValue(undefined);

      await expect(calendarService.toggleCalendarEntryCompletion(userId, entryId)).rejects.toThrow('NotFound');
    });

    it('returns updated entry if successful', async () => {
      const updatedEntry = { ...mockEntry, completed: true };
      mockToggleCompletion.mockResolvedValue(updatedEntry);

      const result = await calendarService.toggleCalendarEntryCompletion(userId, entryId);

      expect(mockToggleCompletion).toHaveBeenCalledWith(userId, entryId);
      expect(result).toEqual(updatedEntry);
    });
  });

  describe('deleteCalendarEntryById', () => {
    it('throws Unauthorized if no userId', async () => {
      await expect(calendarService.deleteCalendarEntryById('', entryId)).rejects.toThrow('Unauthorized');
    });

    it('throws NotFound if DB returns null', async () => {
      mockDeleteCalendarEntry.mockResolvedValue(undefined);

      await expect(calendarService.deleteCalendarEntryById(userId, entryId)).rejects.toThrow('NotFound');
    });

    it('returns deleted entry if successful', async () => {
      mockDeleteCalendarEntry.mockResolvedValue(mockEntry);

      const result = await calendarService.deleteCalendarEntryById(userId, entryId);

      expect(mockDeleteCalendarEntry).toHaveBeenCalledWith(userId, entryId);
      expect(result).toEqual(mockEntry);
    });
  });
});
