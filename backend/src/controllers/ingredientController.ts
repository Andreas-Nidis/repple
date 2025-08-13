import { Request, Response, NextFunction } from 'express';
import * as ingredientService from '../services/ingredientService';

export async function getAllIngredients(req: Request, res: Response, next: NextFunction) {
    try {
        const ingredients = await ingredientService.listIngredients(req.user?.id!);
        res.status(200).json(ingredients);
    } catch (error) {
        next(error);
    }
}

export async function getIngredient(req: Request, res: Response, next: NextFunction) {
    try {
        const ingredient = await ingredientService.getSingleIngredient(req.user?.id!, req.params.ingredientId);
        res.status(200).json(ingredient);
    } catch (error) {
        next(error);
    }
}

export async function createNewIngredient(req: Request, res: Response, next: NextFunction) {
    try {
        const newIngredient = await ingredientService.createNewIngredient(req.user?.id!, req.body.name);
        res.status(201).json(newIngredient);
    } catch (error) {
        next(error);
    }
}

export async function updateExistingIngredient(req: Request, res: Response, next: NextFunction) {
    try {
        const { protein, carbs, fat } = req.body;
        const updatedIngredient = await ingredientService.updateIngredientDetails(
            req.user?.id!,
            req.params.ingredientId,
            protein,
            carbs,
            fat
        );
        res.status(200).json(updatedIngredient);
    } catch (error) {
        next(error);
    }
}

export async function deleteExistingIngredient(req: Request, res: Response, next: NextFunction) {
    try {
        const deletedIngredient = await ingredientService.deleteIngredientById(req.params.ingredientId);
        res.status(200).json(deletedIngredient);
    } catch (error) {
        next(error);
    }
}
