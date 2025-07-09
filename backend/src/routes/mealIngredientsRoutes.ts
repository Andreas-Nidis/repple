import express, { Request, Response } from 'express';

import { authenticateFirebase } from '../middleware/authMiddleware';
import { getIngredientsInMeal, addIngredientToMeal, updateIngredientInMeal, removeIngredientFromMeal } from '../db/mealIngredientsQueries';

const router = express.Router();

// Get all ingredients in a workout
router.get('/:mealId', authenticateFirebase, async (req: Request, res: Response) => {
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
        console.error('Error fetching ingredients:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/:mealId/:ingredientId', authenticateFirebase, async (req: Request, res: Response) => {
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
        console.error('Error adding ingredient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/:mealId/:ingredientId', authenticateFirebase, async (req: Request, res: Response) => {
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
        console.error('Error updating ingredient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/:mealId/:ingredientId', authenticateFirebase, async (req: Request, res: Response) => {
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
        const result = await removeIngredientFromMeal(userId, mealId, ingredientId);
        res.status(200).json({ message: 'Ingredient removed from meal successfully' });
    } catch (error) {
        console.error('Error removing ingredient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;