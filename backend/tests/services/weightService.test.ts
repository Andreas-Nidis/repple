// tests/services/weightService.test.ts
import * as weightDb from '../../src/db/weightQueries';
import * as weightService from '../../src/services/weightService';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

jest.mock('../../src/db/weightQueries');

describe('weightService', () => {
    const userId = 'user1';
    const entryDate = '2025-08-13';
    const weight = 70;

    let mockGetWeightEntries: jest.MockedFunction<typeof weightDb.getWeightEntries>;
    let mockCreateWeightEntry: jest.MockedFunction<typeof weightDb.createWeightEntry>;
    let mockUpdateWeightEntry: jest.MockedFunction<typeof weightDb.updateWeightEntry>;
    let mockDeleteWeightEntries: jest.MockedFunction<typeof weightDb.deleteWeightEntries>;

    beforeEach(() => {
        mockGetWeightEntries = weightDb.getWeightEntries as jest.MockedFunction<typeof weightDb.getWeightEntries>;
        mockCreateWeightEntry = weightDb.createWeightEntry as jest.MockedFunction<typeof weightDb.createWeightEntry>;
        mockUpdateWeightEntry = weightDb.updateWeightEntry as jest.MockedFunction<typeof weightDb.updateWeightEntry>;
        mockDeleteWeightEntries = weightDb.deleteWeightEntries as jest.MockedFunction<typeof weightDb.deleteWeightEntries>;

        jest.resetAllMocks();
    });

    describe('listWeightEntries', () => {
        it('throws Unauthorized if no userId', async () => {
            await expect(weightService.listWeightEntries('')).rejects.toThrow('Unauthorized');
        });

        it('returns entries from DB', async () => {
            const mockEntries = [{ date: entryDate, weight }];
            mockGetWeightEntries.mockResolvedValue(mockEntries);

            const result = await weightService.listWeightEntries(userId);

            expect(mockGetWeightEntries).toHaveBeenCalledWith(userId);
            expect(result).toEqual(mockEntries);
        });

        it('propagates DB errors', async () => {
            mockGetWeightEntries.mockRejectedValue(new Error('DB error'));

            await expect(weightService.listWeightEntries(userId)).rejects.toThrow('DB error');
        });
    });

    describe('addWeightEntry', () => {
        it('throws Unauthorized if no userId', async () => {
            await expect(weightService.addWeightEntry('', entryDate, weight)).rejects.toThrow('Unauthorized');
        });

        it('throws BadRequest if missing entryDate or weight', async () => {
            await expect(weightService.addWeightEntry(userId, '', weight)).rejects.toThrow('BadRequest');
            await expect(weightService.addWeightEntry(userId, entryDate, 0)).rejects.toThrow('BadRequest');
        });

        it('calls createWeightEntry with correct params', async () => {
            mockCreateWeightEntry.mockResolvedValue(undefined);

            const result = await weightService.addWeightEntry(userId, entryDate, weight);

            expect(mockCreateWeightEntry).toHaveBeenCalledWith(userId, entryDate, weight);
            expect(result).toBeUndefined();
        });

        it('propagates DB errors', async () => {
            mockCreateWeightEntry.mockRejectedValue(new Error('DB error'));

            await expect(weightService.addWeightEntry(userId, entryDate, weight)).rejects.toThrow('DB error');
        });
    });

    describe('modifyWeightEntry', () => {
        it('throws Unauthorized if no userId', async () => {
            await expect(weightService.modifyWeightEntry('', entryDate, weight)).rejects.toThrow('Unauthorized');
        });

        it('throws BadRequest if missing entryDate or weight', async () => {
            await expect(weightService.modifyWeightEntry(userId, '', weight)).rejects.toThrow('BadRequest');
            await expect(weightService.modifyWeightEntry(userId, entryDate, 0)).rejects.toThrow('BadRequest');
        });

        it('calls updateWeightEntry with correct params', async () => {
            mockUpdateWeightEntry.mockResolvedValue(undefined);

            const result = await weightService.modifyWeightEntry(userId, entryDate, weight);

            expect(mockUpdateWeightEntry).toHaveBeenCalledWith(userId, entryDate, weight);
            expect(result).toBeUndefined();
        });

        it('propagates DB errors', async () => {
            mockUpdateWeightEntry.mockRejectedValue(new Error('DB error'));

            await expect(weightService.modifyWeightEntry(userId, entryDate, weight)).rejects.toThrow('DB error');
        });
    });

    describe('removeWeightEntry', () => {
        it('throws Unauthorized if no userId', async () => {
            await expect(weightService.removeWeightEntry('', entryDate)).rejects.toThrow('Unauthorized');
        });

        it('throws BadRequest if no entryDate', async () => {
            await expect(weightService.removeWeightEntry(userId, '')).rejects.toThrow('BadRequest');
        });

        it('calls deleteWeightEntries with correct params', async () => {
            mockDeleteWeightEntries.mockResolvedValue(undefined);

            const result = await weightService.removeWeightEntry(userId, entryDate);

            expect(mockDeleteWeightEntries).toHaveBeenCalledWith(userId, entryDate);
            expect(result).toBeUndefined();
        });

        it('propagates DB errors', async () => {
            mockDeleteWeightEntries.mockRejectedValue(new Error('DB error'));

            await expect(weightService.removeWeightEntry(userId, entryDate)).rejects.toThrow('DB error');
        });
    });
});
