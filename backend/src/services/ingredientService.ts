import {
  getAllIngredientsByUserId,
  getIngredientById,
  createIngredient,
  updateIngredient,
  deleteIngredient
} from '../db/ingredientQueries';

export async function listIngredients(userId: string) {
  if (!userId) throw new Error('Unauthorized');
  return getAllIngredientsByUserId(userId);
}

export async function getSingleIngredient(userId: string, ingredientId: string) {
  if (!userId) throw new Error('Unauthorized');
  if (!ingredientId) throw new Error('BadRequest');

  const ingredient = await getIngredientById(userId, ingredientId);
  if (!ingredient) throw new Error('NotFound');

  return ingredient;
}

export async function createNewIngredient(userId: string, name: string) {
  if (!userId) throw new Error('Unauthorized');
  if (!name) throw new Error('BadRequest');

  return createIngredient(userId, name);
}

export async function updateIngredientDetails(
  userId: string,
  ingredientId: string,
  protein?: number,
  carbs?: number,
  fat?: number
) {
  if (!userId) throw new Error('Unauthorized');
  if (!ingredientId) throw new Error('BadRequest');

  const updatedIngredient = await updateIngredient(userId, ingredientId, protein, carbs, fat);
  if (!updatedIngredient) throw new Error('NotFound');

  return updatedIngredient;
}

export async function deleteIngredientById(ingredientId: string) {
  if (!ingredientId) throw new Error('BadRequest');

  const deletedIngredient = await deleteIngredient(ingredientId);
  if (!deletedIngredient) throw new Error('NotFound');

  return deletedIngredient;
}
