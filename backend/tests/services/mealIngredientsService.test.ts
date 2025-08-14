// tests/services/mealIngredientsService.test.ts
import * as mealIngredientsDb from '../../src/db/mealIngredientsQueries';
import * as mealIngredientsService from '../../src/services/mealIngredientsService';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

jest.mock('../../src/db/mealIngredientsQueries');

describe('mealIngredientsService', () => {
  const userId = 'user1';
  const mealId = 'meal1';
  const ingredientId = 'ing1';
  const quantity = 100;
  const fakeResult = [{ meal_id: mealId, ingredient_id: ingredientId, quantity: 100 }];

  let mockGetIngredientsInMeal: jest.MockedFunction<typeof mealIngredientsDb.getIngredientsInMeal>;
  let mockAddIngredientToMeal: jest.MockedFunction<typeof mealIngredientsDb.addIngredientToMeal>;
  let mockUpdateIngredientInMeal: jest.MockedFunction<typeof mealIngredientsDb.updateIngredientInMeal>;
  let mockRemoveIngredientFromMeal: jest.MockedFunction<typeof mealIngredientsDb.removeIngredientFromMeal>;

  beforeEach(() => {
    mockGetIngredientsInMeal = mealIngredientsDb.getIngredientsInMeal as jest.MockedFunction<typeof mealIngredientsDb.getIngredientsInMeal>;
    mockAddIngredientToMeal = mealIngredientsDb.addIngredientToMeal as jest.MockedFunction<typeof mealIngredientsDb.addIngredientToMeal>;
    mockUpdateIngredientInMeal = mealIngredientsDb.updateIngredientInMeal as jest.MockedFunction<typeof mealIngredientsDb.updateIngredientInMeal>;
    mockRemoveIngredientFromMeal = mealIngredientsDb.removeIngredientFromMeal as jest.MockedFunction<typeof mealIngredientsDb.removeIngredientFromMeal>;

    jest.resetAllMocks();
  });

  describe('listMealIngredients', () => {
    it('throws Unauthorized if no userId', async () => {
      await expect(mealIngredientsService.listMealIngredients('', mealId)).rejects.toThrow('Unauthorized');
    });

    it('throws BadRequest if no mealId', async () => {
      await expect(mealIngredientsService.listMealIngredients(userId, '')).rejects.toThrow('BadRequest');
    });

    it('returns ingredients from DB', async () => {
      const fakeIngredients = [{ ingredient_id: ingredientId, quantity, ingredient_name: 'Chicken' }];
      mockGetIngredientsInMeal.mockResolvedValue(fakeIngredients);

      const result = await mealIngredientsService.listMealIngredients(userId, mealId);

      expect(mockGetIngredientsInMeal).toHaveBeenCalledWith(userId, mealId);
      expect(result).toEqual(fakeIngredients);
    });
  });

  describe('addMealIngredient', () => {
    it('throws Unauthorized if no userId', async () => {
      await expect(mealIngredientsService.addMealIngredient('', mealId, ingredientId, quantity)).rejects.toThrow('Unauthorized');
    });

    it('throws BadRequest if no mealId or ingredientId', async () => {
      await expect(mealIngredientsService.addMealIngredient(userId, '', ingredientId, quantity)).rejects.toThrow('BadRequest');
      await expect(mealIngredientsService.addMealIngredient(userId, mealId, '', quantity)).rejects.toThrow('BadRequest');
    });

    it('calls DB and returns result', async () => {
      mockAddIngredientToMeal.mockResolvedValue(fakeResult);

      const result = await mealIngredientsService.addMealIngredient(userId, mealId, ingredientId, quantity);

      expect(mockAddIngredientToMeal).toHaveBeenCalledWith(userId, mealId, ingredientId, quantity);
      expect(result).toEqual(fakeResult);
    });
  });

  describe('updateMealIngredient', () => {
    it('throws Unauthorized if no userId', async () => {
      await expect(mealIngredientsService.updateMealIngredient('', mealId, ingredientId, quantity)).rejects.toThrow('Unauthorized');
    });

    it('throws BadRequest if no mealId or ingredientId', async () => {
      await expect(mealIngredientsService.updateMealIngredient(userId, '', ingredientId, quantity)).rejects.toThrow('BadRequest');
      await expect(mealIngredientsService.updateMealIngredient(userId, mealId, '', quantity)).rejects.toThrow('BadRequest');
    });

    it('calls DB and returns result', async () => {
      mockUpdateIngredientInMeal.mockResolvedValue(fakeResult);

      const result = await mealIngredientsService.updateMealIngredient(userId, mealId, ingredientId, quantity);

      expect(mockUpdateIngredientInMeal).toHaveBeenCalledWith(userId, mealId, ingredientId, quantity);
      expect(result).toEqual(fakeResult);
    });
  });

  describe('removeMealIngredientById', () => {
    it('throws Unauthorized if no userId', async () => {
      await expect(mealIngredientsService.removeMealIngredientById('', mealId, ingredientId)).rejects.toThrow('Unauthorized');
    });

    it('throws BadRequest if no mealId or ingredientId', async () => {
      await expect(mealIngredientsService.removeMealIngredientById(userId, '', ingredientId)).rejects.toThrow('BadRequest');
      await expect(mealIngredientsService.removeMealIngredientById(userId, mealId, '')).rejects.toThrow('BadRequest');
    });

    it('calls DB and returns result', async () => {
      mockRemoveIngredientFromMeal.mockResolvedValue(fakeResult);

      const result = await mealIngredientsService.removeMealIngredientById(userId, mealId, ingredientId);

      expect(mockRemoveIngredientFromMeal).toHaveBeenCalledWith(userId, mealId, ingredientId);
      expect(result).toEqual(fakeResult);
    });
  });
});
