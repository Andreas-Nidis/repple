import {
  getIngredientsInMeal,
  addIngredientToMeal,
  updateIngredientInMeal,
  removeIngredientFromMeal
} from '../db/mealIngredientsQueries';

export async function listMealIngredients(userId: string, mealId: string) {
  if (!userId) throw new Error('Unauthorized');
  if (!mealId) throw new Error('BadRequest');

  return getIngredientsInMeal(userId, mealId);
}

export async function addMealIngredient(userId: string, mealId: string, ingredientId: string, quantity: number) {
  if (!userId) throw new Error('Unauthorized');
  if (!mealId || !ingredientId) throw new Error('BadRequest');

  return addIngredientToMeal(userId, mealId, ingredientId, quantity);
}

export async function updateMealIngredient(userId: string, mealId: string, ingredientId: string, quantity: number) {
  if (!userId) throw new Error('Unauthorized');
  if (!mealId || !ingredientId) throw new Error('BadRequest');

  return updateIngredientInMeal(userId, mealId, ingredientId, quantity);
}

export async function removeMealIngredientById(userId: string, mealId: string, ingredientId: string) {
  if (!userId) throw new Error('Unauthorized');
  if (!mealId || !ingredientId) throw new Error('BadRequest');

  return removeIngredientFromMeal(userId, mealId, ingredientId);
}
