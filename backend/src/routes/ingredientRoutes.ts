import express, { Request, Response } from 'express';
import { getIngredientsByMealId, getIngredientById, createIngredient, updateIngredient, deleteIngredient } from '../db/ingredientQueries';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

// Get all ingredients
router.get('/', authenticateToken, async (req: Request, res: Response) => {
    const mealId = parseInt(req.query.mealId as string, 10);
    if (isNaN(mealId)) {
        res.status(400).json({ error: 'Invalid meal ID' });
        return;
    }
    
    try {
        const ingredients = await getIngredientsByMealId(mealId);
        res.json(ingredients);
    } catch (error) {
        console.error('Error fetching ingredients:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get a specific ingredient by ID
router.get('/:ingredientId', authenticateToken, async (req: Request, res: Response) => {
    const ingredientId = parseInt(req.params.ingredientId, 10);
    try {
        const ingredient = await getIngredientById(ingredientId);
        if (!ingredient) {
            res.status(404).json({ error: 'Ingredient not found' });
            return;
        }
        res.json(ingredient);
    } catch (error) {
        console.error('Error fetching ingredient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create a new ingredient
router.post('/', authenticateToken, async (req: Request, res: Response) => {
    const { name, category, calories, protein, carbs, fats } = req.body;

    if (!name || !category) {
        res.status(400).json({ error: 'Name and category are required' });
        return;
    }

    try {
        const newIngredient = await createIngredient(name, calories, protein, carbs, fats);
        res.status(201).json(newIngredient);
    } catch (error) {
        console.error('Error creating ingredient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update an existing ingredient
router.put('/:ingredientId', authenticateToken, async (req: Request, res: Response) => {
    const ingredientId = parseInt(req.params.ingredientId, 10);
    const { name, category, calories, protein, carbs, fats } = req.body;

    if (!name || !category) {
        res.status(400).json({ error: 'Name and category are required' });
        return;
    }

    try {
        const updatedIngredient = await updateIngredient(ingredientId, name, calories, protein, carbs, fats);
        if (!updatedIngredient) {
            res.status(404).json({ error: 'Ingredient not found' });
            return;
        }
        res.json(updatedIngredient);
    } catch (error) {
        console.error('Error updating ingredient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete an ingredient
router.delete('/:ingredientId', authenticateToken, async (req: Request, res: Response) => {
    const ingredientId = parseInt(req.params.ingredientId, 10);
    try {
        const deletedIngredient = await deleteIngredient(ingredientId);
        if (!deletedIngredient) {
            res.status(404).json({ error: 'Ingredient not found' });
            return;
        }
        res.json(deletedIngredient);
    } catch (error) {
        console.error('Error deleting ingredient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;