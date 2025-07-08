import express, { Request, Response } from 'express';

import { authenticateFirebase } from '../middleware/authMiddleware';
import { getIngredientsInMeal } from '../db/mealIngredientsQueries';
import e from 'express';

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

export default router;