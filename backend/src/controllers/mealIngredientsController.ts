import { Request, Response, NextFunction } from 'express';
import {
  getIngredientsInMeal,
  addIngredientToMeal,
  updateIngredientInMeal,
  removeIngredientFromMeal
} from '../db/mealIngredientsQueries';

export async function getMealIngredients(req: Request, res: Response, next: NextFunction): Promise<void> {
  const userId = req.user?.id;
  const mealId = req.params.mealId;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  if (!mealId) {
    res.status(400).json({ error: 'Meal ID is required' });
    return;
  }

  try {
    const mealIngredients = await getIngredientsInMeal(userId, mealId);
    res.json(mealIngredients);
  } catch (error) {
    next(error);
  }
}

export async function addIngredient(req: Request, res: Response, next: NextFunction): Promise<void> {
  const userId = req.user?.id;
  const mealId = req.params.mealId;
  const ingredientId = req.params.ingredientId;
  const { quantity } = req.body;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  if (!mealId || !ingredientId) {
    res.status(400).json({ error: 'Meal ID and Ingredient ID are required' });
    return;
  }

  try {
    const result = await addIngredientToMeal(userId, mealId, ingredientId, quantity);
    res.status(201).json({ message: 'Ingredient added to meal successfully', result });
  } catch (error) {
    next(error);
  }
}

export async function updateIngredient(req: Request, res: Response, next: NextFunction): Promise<void> {
  const userId = req.user?.id;
  const mealId = req.params.mealId;
  const ingredientId = req.params.ingredientId;
  const { quantity } = req.body;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  if (!mealId || !ingredientId) {
    res.status(400).json({ error: 'Meal ID and Ingredient ID are required' });
    return;
  }

  try {
    const result = await updateIngredientInMeal(userId, mealId, ingredientId, quantity);
    res.status(200).json({ message: 'Ingredient updated in meal successfully', result });
  } catch (error) {
    next(error);
  }
}

export async function removeIngredient(req: Request, res: Response, next: NextFunction): Promise<void> {
  const userId = req.user?.id;
  const mealId = req.params.mealId;
  const ingredientId = req.params.ingredientId;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  if (!mealId || !ingredientId) {
    res.status(400).json({ error: 'Meal ID and Ingredient ID are required' });
    return;
  }

  try {
    await removeIngredientFromMeal(userId, mealId, ingredientId);
    res.status(200).json({ message: 'Ingredient removed from meal successfully' });
  } catch (error) {
    next(error);
  }
}
