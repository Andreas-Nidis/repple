import { Request, Response, NextFunction } from 'express';
import {
  getMealsByUser,
  getMealById,
  getMealIngredients,
  createMeal,
  updateMeal,
  updateMealIngredient,
  addIngredientToMeal,
  deleteMeal,
  getMealSummary
} from '../db/mealQueries';

export async function getMeals(req: Request, res: Response, next: NextFunction): Promise<void> {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const meals = await getMealsByUser(userId);
    res.json(meals);
  } catch (error) {
    next(error);
  }
}

export async function getMeal(req: Request, res: Response, next: NextFunction): Promise<void> {
  const userId = req.user?.id;
  const mealId = req.params.mealId;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const meal = await getMealById(userId, mealId);
    if (!meal) {
      res.status(404).json({ error: 'Meal not found' });
      return;
    }
    res.json(meal);
  } catch (error) {
    next(error);
  }
}

export async function getMealIngredientsHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const userId = req.user?.id;
  const mealId = req.params.mealId;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const ingredients = await getMealIngredients(userId, mealId);
    res.json(ingredients);
  } catch (error) {
    next(error);
  }
}

export async function createMealHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const userId = req.user?.id;
  const { name } = req.body;

  if (!userId || !name) {
    res.status(400).json({ error: 'Name is required or unauthorized' });
    return;
  }

  try {
    const newMeal = await createMeal(userId, name);
    res.status(201).json(newMeal);
  } catch (error) {
    next(error);
  }
}

export async function updateMealHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const userId = req.user?.id;
  const mealId = req.params.mealId;
  const { name, ingredients } = req.body;

  if (!userId || !name) {
    res.status(400).json({ error: 'Name is required' });
    return;
  }

  try {
    const updatedMeal = await updateMeal(mealId, name, ingredients);
    if (!updatedMeal || updatedMeal.user_id !== userId) {
      res.status(404).json({ error: 'Meal not found' });
      return;
    }
    res.json(updatedMeal);
  } catch (error) {
    next(error);
  }
}

export async function updateMealIngredientHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const userId = req.user?.id;
  const mealId = req.params.mealId;
  const ingredientId = req.params.ingredientId;
  const { quantity, unit } = req.body;

  if (!userId || !mealId || !ingredientId) {
    res.status(400).json({ error: 'Invalid meal or ingredient ID or unauthorized' });
    return;
  }

  try {
    const updatedIngredient = await updateMealIngredient(userId, mealId, ingredientId, quantity, unit);
    if (!updatedIngredient) {
      res.status(404).json({ error: 'Ingredient not found in this meal' });
      return;
    }
    res.json(updatedIngredient);
  } catch (error) {
    next(error);
  }
}

export async function addIngredientHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const userId = req.user?.id;
  const mealId = req.params.mealId;
  const { ingredientId, quantity, unit } = req.body;

  if (!userId || !mealId || !ingredientId || !quantity || !unit) {
    res.status(400).json({ error: 'Ingredient ID, quantity, and unit are required' });
    return;
  }

  try {
    const newIngredient = await addIngredientToMeal(userId, mealId, ingredientId, quantity, unit);
    res.status(201).json(newIngredient);
  } catch (error) {
    next(error);
  }
}

export async function deleteMealHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const userId = req.user?.id;
  const mealId = req.params.mealId;

  if (!userId || !mealId) {
    res.status(400).json({ error: 'Invalid meal ID or unauthorized' });
    return;
  }

  try {
    const deletedMeal = await deleteMeal(userId, mealId);
    if (!deletedMeal || deletedMeal.user_id !== userId) {
      res.status(404).json({ error: 'Meal not found' });
      return;
    }
    res.json(deletedMeal);
  } catch (error) {
    next(error);
  }
}

export async function getMealSummaryHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const userId = req.user?.id;
  const mealId = req.params.mealId;

  if (!userId || !mealId) {
    res.status(400).json({ error: 'Invalid meal ID or unauthorized' });
    return;
  }

  try {
    const summary = await getMealSummary(userId, mealId);
    res.json(summary);
  } catch (error) {
    next(error);
  }
}
