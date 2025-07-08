import express, { Request, Response } from 'express';
import { getAllIngredientsByUserId, getIngredientById, createIngredient, updateIngredient, deleteIngredient } from '../db/ingredientQueries';
import { authenticateFirebase } from '../middleware/authMiddleware';

const router = express.Router();

// Get all ingredients
router.get('/', authenticateFirebase, async (req: Request, res: Response) => {
    const userId = req.user?.id; // Assuming user ID is stored in req.user after authentication
    
    try {
        const ingredients = await getAllIngredientsByUserId(userId);
        res.json(ingredients);
    } catch (error) {
        console.error('Error fetching ingredients:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get a specific ingredient by ID
router.get('/:ingredientId', authenticateFirebase, async (req: Request, res: Response) => {
    const ingredientId = req.params.ingredientId;
    const userId = req.user?.id;
    
    try {
        const ingredient = await getIngredientById(userId, ingredientId);
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
router.post('/', authenticateFirebase, async (req: Request, res: Response) => {
    const userId = req.user?.id; // Assuming user ID is stored in req.user after authentication
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
        console.error('Error creating ingredient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update an existing ingredient
router.put('/:ingredientId', authenticateFirebase, async (req: Request, res: Response) => {
    const ingredientId = req.params.ingredientId;
    const userId = req.user?.id;
    const { protein, carbs, fat } = req.body;

    try {
        const updatedIngredient = await updateIngredient(userId, ingredientId, protein, carbs, fat);
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
router.delete('/:ingredientId', authenticateFirebase, async (req: Request, res: Response) => {
    const ingredientId = req.params.ingredientId;
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