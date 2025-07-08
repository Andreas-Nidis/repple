import express, { Request, Response } from 'express';
import { getMealsByUser, getMealById, getMealIngredients, getMealSummary, createMeal, addIngredientToMeal, updateMeal, updateMealIngredient, deleteMeal } from '../db/mealQueries';
import { authenticateFirebase } from '../middleware/authMiddleware';

const router = express.Router();

// Get all meals for a user
router.get('/', authenticateFirebase, async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    try {
        const meals = await getMealsByUser(userId);
        res.json(meals);
    } catch (error) {
        console.error('Error fetching meals:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get a specific meal by ID
router.get('/:mealId', authenticateFirebase, async (req: Request, res: Response) => {
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
        console.error('Error fetching meal:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get ingredients for a specific meal
router.get('/:mealId/ingredients', authenticateFirebase, async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    const mealId = req.params.mealId;


    try {
        const ingredients = await getMealIngredients(userId, mealId);
        res.json(ingredients);
    } catch (error) {
        console.error('Error fetching meal ingredients:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create a new meal
router.post('/', authenticateFirebase, async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { name } = req.body;

    if (!userId || !name) {
        res.status(400).json({ error: 'Name is required or unaothorized' });
        return;
    }

    try {
        const newMeal = await createMeal(userId, name);
        res.status(201).json(newMeal);
    } catch (error) {
        console.error('Error creating meal:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update an existing meal
router.put('/:mealId', authenticateFirebase, async (req: Request, res: Response) => {
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
        console.error('Error updating meal:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update an ingredient in a meal
router.put('/:mealId/ingredients/:ingredientId', authenticateFirebase, async (req: Request, res: Response) => {
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
        console.error('Error updating meal ingredient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add an ingredient to a meal
router.post('/:mealId/ingredients', authenticateFirebase, async (req: Request, res: Response) => {
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
        console.error('Error adding ingredient to meal:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a meal
router.delete('/:mealId', authenticateFirebase, async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const mealId = req.params.mealId;
    if (!userId || !mealId) {
        res.status(400).json({ error: 'Invalid meal ID' });
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
        console.error('Error deleting meal:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get meal summary
router.get('/:mealId/summary', authenticateFirebase, async (req: Request, res: Response) => {
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
        console.error('Error fetching meal summary:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;