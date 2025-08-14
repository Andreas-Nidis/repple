import * as mealDb from '../../src/db/mealQueries';
import {
  listMeals,
  getSingleMeal,
  createNewMeal,
  updateMealDetails,
  deleteMealById,
} from '../../src/services/mealService';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

jest.mock('../../src/db/mealQueries');

describe('mealService', () => {
  let mockGetMealsByUser: jest.MockedFunction<typeof mealDb.getMealsByUser>;
  let mockGetMealById: jest.MockedFunction<typeof mealDb.getMealById>;
  let mockCreateMeal: jest.MockedFunction<typeof mealDb.createMeal>;
  let mockUpdateMeal: jest.MockedFunction<typeof mealDb.updateMeal>;
  let mockDeleteMeal: jest.MockedFunction<typeof mealDb.deleteMeal>;

  beforeEach(() => {
    mockGetMealsByUser = mealDb.getMealsByUser as jest.MockedFunction<typeof mealDb.getMealsByUser>;
    mockGetMealById = mealDb.getMealById as jest.MockedFunction<typeof mealDb.getMealById>;
    mockCreateMeal = mealDb.createMeal as jest.MockedFunction<typeof mealDb.createMeal>;
    mockUpdateMeal = mealDb.updateMeal as jest.MockedFunction<typeof mealDb.updateMeal>;
    mockDeleteMeal = mealDb.deleteMeal as jest.MockedFunction<typeof mealDb.deleteMeal>;

    jest.resetAllMocks();
  });

  describe('listMeals', () => {
    it('throws Unauthorized if no userId', async () => {
      await expect(listMeals('')).rejects.toThrow('Unauthorized');
    });

    it('returns meals from DB', async () => {
      const fakeMeals = [{ id: 'm1', name: 'Salad' }];
      mockGetMealsByUser.mockResolvedValue(fakeMeals);

      const result = await listMeals('u1');

      expect(mockGetMealsByUser).toHaveBeenCalledWith('u1');
      expect(result).toEqual(fakeMeals);
    });
  });

  describe('getSingleMeal', () => {
    it('throws Unauthorized if no userId', async () => {
      await expect(getSingleMeal('', 'm1')).rejects.toThrow('Unauthorized');
    });

    it('throws BadRequest if no mealId', async () => {
      await expect(getSingleMeal('u1', '')).rejects.toThrow('BadRequest');
    });

    it('throws NotFound if meal does not exist', async () => {
      mockGetMealById.mockResolvedValue(undefined);

      await expect(getSingleMeal('u1', 'm1')).rejects.toThrow('NotFound');
    });

    it('returns the meal if found', async () => {
      const fakeMeal = { id: 'm1', name: 'Salad' };
      mockGetMealById.mockResolvedValue([fakeMeal]);

      const result = await getSingleMeal('u1', 'm1');

      expect(mockGetMealById).toHaveBeenCalledWith('u1', 'm1');
      expect(result).toEqual([fakeMeal]);
    });
  });

  describe('createNewMeal', () => {
    it('throws Unauthorized if no userId', async () => {
      await expect(createNewMeal('', 'Salad')).rejects.toThrow('Unauthorized');
    });

    it('throws BadRequest if no name', async () => {
      await expect(createNewMeal('u1', '')).rejects.toThrow('BadRequest');
    });

    it('creates a meal and returns it', async () => {
      const fakeMeal = { id: 'm1', name: 'Salad' };
      mockCreateMeal.mockResolvedValue(fakeMeal);

      const result = await createNewMeal('u1', 'Salad');

      expect(mockCreateMeal).toHaveBeenCalledWith('u1', 'Salad');
      expect(result).toEqual(fakeMeal);
    });
  });

  describe('updateMealDetails', () => {
    it('throws Unauthorized if no userId', async () => {
      await expect(updateMealDetails('', 'm1')).rejects.toThrow('Unauthorized');
    });

    it('throws BadRequest if no mealId', async () => {
      await expect(updateMealDetails('u1', '')).rejects.toThrow('BadRequest');
    });

    it('throws NotFound if DB returns undefined', async () => {
      mockUpdateMeal.mockResolvedValue(undefined);

      await expect(updateMealDetails('u1', 'm1')).rejects.toThrow('NotFound');
    });

    it('throws NotFound if meal belongs to another user', async () => {
      mockUpdateMeal.mockResolvedValue({ id: 'm1', user_id: 'otherUser' });

      await expect(updateMealDetails('u1', 'm1')).rejects.toThrow('NotFound');
    });

    it('returns updated meal if successful', async () => {
      const updatedMeal = { id: 'm1', user_id: 'u1', name: 'Updated Salad' };
      mockUpdateMeal.mockResolvedValue(updatedMeal);

      const result = await updateMealDetails('u1', 'm1', 20, 10, 5, true);

      expect(mockUpdateMeal).toHaveBeenCalledWith('u1', 'm1', 20, 10, 5, true);
      expect(result).toEqual(updatedMeal);
    });
  });

  describe('deleteMealById', () => {
    it('throws Unauthorized if no userId', async () => {
      await expect(deleteMealById('', 'm1')).rejects.toThrow('Unauthorized');
    });

    it('throws BadRequest if no mealId', async () => {
      await expect(deleteMealById('u1', '')).rejects.toThrow('BadRequest');
    });

    it('throws NotFound if DB returns undefined', async () => {
      mockDeleteMeal.mockResolvedValue(undefined);

      await expect(deleteMealById('u1', 'm1')).rejects.toThrow('NotFound');
    });

    it('throws NotFound if meal belongs to another user', async () => {
      mockDeleteMeal.mockResolvedValue({ id: 'm1', user_id: 'otherUser' });

      await expect(deleteMealById('u1', 'm1')).rejects.toThrow('NotFound');
    });

    it('returns deleted meal if successful', async () => {
      const deletedMeal = { id: 'm1', user_id: 'u1', name: 'Salad' };
      mockDeleteMeal.mockResolvedValue(deletedMeal);

      const result = await deleteMealById('u1', 'm1');

      expect(mockDeleteMeal).toHaveBeenCalledWith('u1', 'm1');
      expect(result).toEqual(deletedMeal);
    });
  });
});
