// tests/services/ingredientService.test.ts
import * as ingredientDb from '../../src/db/ingredientQueries';
import * as ingredientService from '../../src/services/ingredientService';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

jest.mock('../../src/db/ingredientQueries');

describe('ingredientService', () => {
  const userId = 'user1';
  const ingredientId = 'ing1';

  let mockGetAllIngredientsByUserId: jest.MockedFunction<typeof ingredientDb.getAllIngredientsByUserId>;
  let mockGetIngredientById: jest.MockedFunction<typeof ingredientDb.getIngredientById>;
  let mockCreateIngredient: jest.MockedFunction<typeof ingredientDb.createIngredient>;
  let mockUpdateIngredient: jest.MockedFunction<typeof ingredientDb.updateIngredient>;
  let mockDeleteIngredient: jest.MockedFunction<typeof ingredientDb.deleteIngredient>;

  beforeEach(() => {
    mockGetAllIngredientsByUserId = ingredientDb.getAllIngredientsByUserId as jest.MockedFunction<typeof ingredientDb.getAllIngredientsByUserId>;
    mockGetIngredientById = ingredientDb.getIngredientById as jest.MockedFunction<typeof ingredientDb.getIngredientById>;
    mockCreateIngredient = ingredientDb.createIngredient as jest.MockedFunction<typeof ingredientDb.createIngredient>;
    mockUpdateIngredient = ingredientDb.updateIngredient as jest.MockedFunction<typeof ingredientDb.updateIngredient>;
    mockDeleteIngredient = ingredientDb.deleteIngredient as jest.MockedFunction<typeof ingredientDb.deleteIngredient>;

    jest.resetAllMocks();
  });

  describe('listIngredients', () => {
    it('throws Unauthorized if no userId', async () => {
      await expect(ingredientService.listIngredients('')).rejects.toThrow('Unauthorized');
    });

    it('returns ingredients from DB', async () => {
      const mockIngredients = [{ id: ingredientId, name: 'Protein Powder' }];
      mockGetAllIngredientsByUserId.mockResolvedValue(mockIngredients);

      const result = await ingredientService.listIngredients(userId);

      expect(mockGetAllIngredientsByUserId).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockIngredients);
    });
  });

  describe('getSingleIngredient', () => {
    it('throws Unauthorized if no userId', async () => {
      await expect(ingredientService.getSingleIngredient('', ingredientId)).rejects.toThrow('Unauthorized');
    });

    it('throws BadRequest if no ingredientId', async () => {
      await expect(ingredientService.getSingleIngredient(userId, '')).rejects.toThrow('BadRequest');
    });

    it('throws NotFound if ingredient does not exist', async () => {
      mockGetIngredientById.mockResolvedValue(undefined);

      await expect(ingredientService.getSingleIngredient(userId, ingredientId)).rejects.toThrow('NotFound');
    });

    it('returns the ingredient if found', async () => {
      const mockIngredient = { id: ingredientId, name: 'Protein Powder' };
      mockGetIngredientById.mockResolvedValue(mockIngredient);

      const result = await ingredientService.getSingleIngredient(userId, ingredientId);

      expect(mockGetIngredientById).toHaveBeenCalledWith(userId, ingredientId);
      expect(result).toEqual(mockIngredient);
    });
  });

  describe('createNewIngredient', () => {
    it('throws Unauthorized if no userId', async () => {
      await expect(ingredientService.createNewIngredient('', 'Protein Powder')).rejects.toThrow('Unauthorized');
    });

    it('throws BadRequest if no name', async () => {
      await expect(ingredientService.createNewIngredient(userId, '')).rejects.toThrow('BadRequest');
    });

    it('creates and returns new ingredient', async () => {
      const mockIngredient = { id: ingredientId, name: 'Protein Powder' };
      mockCreateIngredient.mockResolvedValue(mockIngredient);

      const result = await ingredientService.createNewIngredient(userId, 'Protein Powder');

      expect(mockCreateIngredient).toHaveBeenCalledWith(userId, 'Protein Powder');
      expect(result).toEqual(mockIngredient);
    });
  });

  describe('updateIngredientDetails', () => {
    it('throws Unauthorized if no userId', async () => {
      await expect(ingredientService.updateIngredientDetails('', ingredientId, 20, 5, 1)).rejects.toThrow('Unauthorized');
    });

    it('throws BadRequest if no ingredientId', async () => {
      await expect(ingredientService.updateIngredientDetails(userId, '', 20, 5, 1)).rejects.toThrow('BadRequest');
    });

    it('throws NotFound if ingredient does not exist', async () => {
      mockUpdateIngredient.mockResolvedValue(undefined);

      await expect(ingredientService.updateIngredientDetails(userId, ingredientId, 20, 5, 1)).rejects.toThrow('NotFound');
    });

    it('returns updated ingredient if successful', async () => {
      const updatedIngredient = { id: ingredientId, name: 'Protein Powder', protein: 20, carbs: 5, fat: 1 };
      mockUpdateIngredient.mockResolvedValue(updatedIngredient);

      const result = await ingredientService.updateIngredientDetails(userId, ingredientId, 20, 5, 1);

      expect(mockUpdateIngredient).toHaveBeenCalledWith(userId, ingredientId, 20, 5, 1);
      expect(result).toEqual(updatedIngredient);
    });
  });

  describe('deleteIngredientById', () => {
    it('throws BadRequest if no ingredientId', async () => {
      await expect(ingredientService.deleteIngredientById('')).rejects.toThrow('BadRequest');
    });

    it('throws NotFound if ingredient does not exist', async () => {
      mockDeleteIngredient.mockResolvedValue(undefined);

      await expect(ingredientService.deleteIngredientById(ingredientId)).rejects.toThrow('NotFound');
    });

    it('returns deleted ingredient if successful', async () => {
      const deletedIngredient = { id: ingredientId, name: 'Protein Powder' };
      mockDeleteIngredient.mockResolvedValue(deletedIngredient);

      const result = await ingredientService.deleteIngredientById(ingredientId);

      expect(mockDeleteIngredient).toHaveBeenCalledWith(ingredientId);
      expect(result).toEqual(deletedIngredient);
    });
  });
});
