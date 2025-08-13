import { Request, Response, NextFunction } from 'express';
import * as mealService from '../services/mealIngredientsService';

export async function getMealIngredients(req: Request, res: Response, next: NextFunction) {
    try {
        const ingredients = await mealService.listMealIngredients(req.user?.id!, req.params.mealId);
        res.status(200).json(ingredients);
    } catch (error) {
        next(error);
    }
}

export async function addIngredient(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await mealService.addMealIngredient(
            req.user?.id!,
            req.params.mealId,
            req.params.ingredientId,
            req.body.quantity
        );
        res.status(201).json({ message: 'Ingredient added to meal successfully', result });
    } catch (error) {
        next(error);
    }
}

export async function updateIngredient(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await mealService.updateMealIngredient(
            req.user?.id!,
            req.params.mealId,
            req.params.ingredientId,
            req.body.quantity
        );
        res.status(200).json({ message: 'Ingredient updated in meal successfully', result });
    } catch (error) {
        next(error);
    }
}

export async function removeIngredient(req: Request, res: Response, next: NextFunction) {
    try {
        await mealService.removeMealIngredientById(
            req.user?.id!,
            req.params.mealId,
            req.params.ingredientId
        );
        res.status(200).json({ message: 'Ingredient removed from meal successfully' });
    } catch (error) {
        next(error);
    }
}
