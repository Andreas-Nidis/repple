// tests/services/exerciseService.test.ts
import * as exerciseDb from '../../src/db/exerciseQueries';
import * as exerciseService from '../../src/services/exerciseService';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

jest.mock('../../src/db/exerciseQueries');

describe('exerciseService', () => {
  const userId = 'user1';
  const exerciseId = 'ex1';
  const mockExercise = { id: exerciseId, name: 'Push-up', category: 'Strength' };

  let mockGetExercisesByUser: jest.MockedFunction<typeof exerciseDb.getExercisesByUser>;
  let mockGetExerciseById: jest.MockedFunction<typeof exerciseDb.getExerciseById>;
  let mockCreateExercise: jest.MockedFunction<typeof exerciseDb.createExercise>;
  let mockUpdateExercise: jest.MockedFunction<typeof exerciseDb.updateExercise>;
  let mockDeleteExercise: jest.MockedFunction<typeof exerciseDb.deleteExercise>;

  beforeEach(() => {
    mockGetExercisesByUser = exerciseDb.getExercisesByUser as jest.MockedFunction<typeof exerciseDb.getExercisesByUser>;
    mockGetExerciseById = exerciseDb.getExerciseById as jest.MockedFunction<typeof exerciseDb.getExerciseById>;
    mockCreateExercise = exerciseDb.createExercise as jest.MockedFunction<typeof exerciseDb.createExercise>;
    mockUpdateExercise = exerciseDb.updateExercise as jest.MockedFunction<typeof exerciseDb.updateExercise>;
    mockDeleteExercise = exerciseDb.deleteExercise as jest.MockedFunction<typeof exerciseDb.deleteExercise>;

    jest.resetAllMocks();
  });

  describe('listExercises', () => {
    it('throws Unauthorized if no userId', async () => {
      await expect(exerciseService.listExercises('')).rejects.toThrow('Unauthorized');
    });

    it('returns exercises from DB', async () => {
      mockGetExercisesByUser.mockResolvedValue([mockExercise]);

      const result = await exerciseService.listExercises(userId);

      expect(mockGetExercisesByUser).toHaveBeenCalledWith(userId);
      expect(result).toEqual([mockExercise]);
    });
  });

  describe('getSingleExercise', () => {
    it('throws NotFound if exercise does not exist', async () => {
      mockGetExerciseById.mockResolvedValue(undefined);

      await expect(exerciseService.getSingleExercise(exerciseId)).rejects.toThrow('NotFound');
    });

    it('returns the exercise if found', async () => {
      mockGetExerciseById.mockResolvedValue(mockExercise);

      const result = await exerciseService.getSingleExercise(exerciseId);

      expect(mockGetExerciseById).toHaveBeenCalledWith(exerciseId);
      expect(result).toEqual(mockExercise);
    });
  });

  describe('createNewExercise', () => {
    it('throws Unauthorized if no userId', async () => {
      await expect(exerciseService.createNewExercise('', 'Push-up')).rejects.toThrow('Unauthorized');
    });

    it('throws BadRequest if no name or not a string', async () => {
      await expect(exerciseService.createNewExercise(userId, '')).rejects.toThrow('BadRequest');
      // @ts-expect-error test invalid type
      await expect(exerciseService.createNewExercise(userId, 123)).rejects.toThrow('BadRequest');
    });

    it('creates a new exercise and returns it', async () => {
      mockCreateExercise.mockResolvedValue(mockExercise);

      const result = await exerciseService.createNewExercise(userId, 'Push-up', 'Strength');

      expect(mockCreateExercise).toHaveBeenCalledWith(userId, 'Push-up', 'Strength', undefined, undefined, undefined);
      expect(result).toEqual(mockExercise);
    });
  });

  describe('updateExistingExercise', () => {
    it('throws NotFound if DB returns null', async () => {
      mockUpdateExercise.mockResolvedValue(undefined);

      await expect(exerciseService.updateExistingExercise(exerciseId, 'Pull-up')).rejects.toThrow('NotFound');
    });

    it('returns updated exercise if successful', async () => {
      const updatedExercise = { id: exerciseId, name: 'Pull-up' };
      mockUpdateExercise.mockResolvedValue(updatedExercise);

      const result = await exerciseService.updateExistingExercise(exerciseId, 'Pull-up');

      expect(mockUpdateExercise).toHaveBeenCalledWith(exerciseId, 'Pull-up', undefined, undefined, undefined, undefined);
      expect(result).toEqual(updatedExercise);
    });
  });

  describe('deleteExistingExercise', () => {
    it('calls deleteExercise with correct id', async () => {
      mockDeleteExercise.mockResolvedValue(undefined);

      await exerciseService.deleteExistingExercise(exerciseId);

      expect(mockDeleteExercise).toHaveBeenCalledWith(exerciseId);
    });
  });
});
