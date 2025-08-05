import { Request, Response, NextFunction } from 'express';
import {
  getMealsByUser,
  getMealById,
  createMeal,
  updateMeal,
  deleteMeal,
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
  const { total_protein, total_carbs, total_fat, selected } = req.body;

  if (!userId) {
    res.status(400).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const updatedMeal = await updateMeal(userId, mealId, total_protein, total_carbs, total_fat, selected);
    if (!updatedMeal || updatedMeal.user_id !== userId) {
      res.status(404).json({ error: 'Meal not found' });
      return;
    }
    res.json(updatedMeal);
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