import { Request, Response, NextFunction } from 'express';
import * as mealService from '../services/mealService';

export async function getMeals(req: Request, res: Response, next: NextFunction) {
    try {
        const meals = await mealService.listMeals(req.user?.id!);
        res.status(200).json(meals);
    } catch (error) {
        next(error);
    }
}

export async function getMeal(req: Request, res: Response, next: NextFunction) {
    try {
        const meal = await mealService.getSingleMeal(req.user?.id!, req.params.mealId);
        res.status(200).json(meal);
    } catch (error) {
        next(error);
    }
}

export async function createMeal(req: Request, res: Response, next: NextFunction) {
    try {
        const newMeal = await mealService.createNewMeal(req.user?.id!, req.body.name);
        res.status(201).json(newMeal);
    } catch (error) {
        next(error);
    }
}

export async function updateMeal(req: Request, res: Response, next: NextFunction) {
    try {
        const { total_protein, total_carbs, total_fat, selected } = req.body;
        const updatedMeal = await mealService.updateMealDetails(
            req.user?.id!,
            req.params.mealId,
            total_protein,
            total_carbs,
            total_fat,
            selected
        );
        res.status(200).json(updatedMeal);
    } catch (error) {
        next(error);
    }
}

export async function deleteMeal(req: Request, res: Response, next: NextFunction) {
    try {
        const deletedMeal = await mealService.deleteMealById(req.user?.id!, req.params.mealId);
        res.status(200).json(deletedMeal);
    } catch (error) {
        next(error);
    }
}
