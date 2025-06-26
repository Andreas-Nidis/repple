import express, { Request, Response } from 'express';
import { getExercisesByUser, getExerciseById, createExercise, updateExercise, deleteExercise } from '../db/exerciseQueries';
import { authenticateFirebase } from '../middleware/authMiddleware';

const router = express.Router();

// Get all exercises for a user
router.get('/', authenticateFirebase, async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    const exercises = await getExercisesByUser(userId);
    res.json(exercises);
});

// Get a specific exercise by ID
router.get('/:id', authenticateFirebase, async (req: Request, res: Response) => {
    const exerciseId = req.params.id;
    const exercise = await getExerciseById(exerciseId);
    if (!exercise) {
        res.status(404).json({ error: 'Exercise not found' });
        return;
    }
    res.json(exercise);
});

// Create a new exercise
router.post('/', authenticateFirebase, async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { name, category, equipment, description, tutorial_url } = req.body;
    if (!name || typeof name !== 'string') {
        res.status(400).json({ error: 'Invalid input data' });
        return;
    }
    
    const newExercise = await createExercise(userId, name, category, equipment, description, tutorial_url);
    res.status(201).json(newExercise);
});

// Update an existing exercise
router.put('/:id', authenticateFirebase, async (req: Request, res: Response) => {
    const id = req.params.id;
    const { name, category, equipment, description, tutorial_url } = req.body;
    const updatedExercise = await updateExercise(id, name, category, equipment, description, tutorial_url);
    if (!updatedExercise) {
        res.status(404).json({ error: 'Exercise not found' });
        return;
    }
    res.json(updatedExercise);
});

// Delete an exercise
router.delete('/:id', authenticateFirebase, async (req: Request, res: Response) => {
    const id = req.params.id;
    await deleteExercise(id);
    res.status(204).send();
});

export default router;
// This file defines the routes for managing exercises in the application.