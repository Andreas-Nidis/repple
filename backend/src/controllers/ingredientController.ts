import { Request, Response, NextFunction } from 'express';
import {
  getAllIngredientsByUserId,
  getIngredientById,
  createIngredient,
  updateIngredient,
  deleteIngredient
} from '../db/ingredientQueries';

export async function getAllIngredients(req: Request, res: Response, next: NextFunction): Promise<void> {
  const userId = req.user?.id;

  try {
    const ingredients = await getAllIngredientsByUserId(userId);
    res.json(ingredients);
  } catch (error) {
    next(error);
  }
}

export async function getIngredient(req: Request, res: Response, next: NextFunction): Promise<void> {
  const userId = req.user?.id;
  const ingredientId = req.params.ingredientId;

  try {
    const ingredient = await getIngredientById(userId, ingredientId);

    if (!ingredient) {
      res.status(404).json({ error: 'Ingredient not found' });
      return;
    }

    res.json(ingredient);
  } catch (error) {
    next(error);
  }
}

export async function createNewIngredient(req: Request, res: Response, next: NextFunction): Promise<void> {
  const userId = req.user?.id;
  const { name } = req.body;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  if (!name) {
    res.status(400).json({ error: 'Name is required' });
    return;
  }

  try {
    const newIngredient = await createIngredient(userId, name);
    res.status(201).json(newIngredient);
  } catch (error) {
    next(error);
  }
}

export async function updateExistingIngredient(req: Request, res: Response, next: NextFunction): Promise<void> {
  const userId = req.user?.id;
  const ingredientId = req.params.ingredientId;
  const { protein, carbs, fat } = req.body;

  try {
    const updatedIngredient = await updateIngredient(userId, ingredientId, protein, carbs, fat);

    if (!updatedIngredient) {
      res.status(404).json({ error: 'Ingredient not found' });
      return;
    }

    res.json(updatedIngredient);
  } catch (error) {
    next(error);
  }
}

export async function deleteExistingIngredient(req: Request, res: Response, next: NextFunction): Promise<void> {
  const ingredientId = req.params.ingredientId;

  try {
    const deletedIngredient = await deleteIngredient(ingredientId);

    if (!deletedIngredient) {
      res.status(404).json({ error: 'Ingredient not found' });
      return;
    }

    res.json(deletedIngredient);
  } catch (error) {
    next(error);
  }
}
