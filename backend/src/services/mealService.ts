import {
  getMealsByUser,
  getMealById,
  createMeal,
  updateMeal,
  deleteMeal,
} from '../db/mealQueries';

export async function listMeals(userId: string) {
  if (!userId) throw new Error('Unauthorized');
  return getMealsByUser(userId);
}

export async function getSingleMeal(userId: string, mealId: string) {
  if (!userId) throw new Error('Unauthorized');
  if (!mealId) throw new Error('BadRequest');

  const meal = await getMealById(userId, mealId);
  if (!meal) throw new Error('NotFound');

  return meal;
}

export async function createNewMeal(userId: string, name: string) {
  if (!userId) throw new Error('Unauthorized');
  if (!name) throw new Error('BadRequest');

  return createMeal(userId, name);
}

export async function updateMealDetails(
  userId: string,
  mealId: string,
  total_protein?: number,
  total_carbs?: number,
  total_fat?: number,
  selected?: boolean
) {
  if (!userId) throw new Error('Unauthorized');
  if (!mealId) throw new Error('BadRequest');

  const updatedMeal = await updateMeal(userId, mealId, total_protein, total_carbs, total_fat, selected);
  if (!updatedMeal || updatedMeal.user_id !== userId) throw new Error('NotFound');

  return updatedMeal;
}

export async function deleteMealById(userId: string, mealId: string) {
  if (!userId) throw new Error('Unauthorized');
  if (!mealId) throw new Error('BadRequest');

  const deletedMeal = await deleteMeal(userId, mealId);
  if (!deletedMeal || deletedMeal.user_id !== userId) throw new Error('NotFound');

  return deletedMeal;
}
