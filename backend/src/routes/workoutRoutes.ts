import express, { Request, Response } from 'express';
import { getWorkoutsByUser, getWorkoutById, createWorkout, updateWorkout, deleteWorkout } from '../db/workoutQueries';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

// Get all workouts for a user
router.get('/', authenticateToken, async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    try {
        const workouts = await getWorkoutsByUser(userId);
        res.json(workouts);
    } catch (error) {
        console.error('Error fetching workouts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get a specific workout by ID
router.get('/:workoutId', authenticateToken, async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const workoutId = parseInt(req.params.workoutId, 10);
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    try {
        const workoutArr = await getWorkoutById(workoutId);
        const workout = workoutArr[0];
        if (!workout || workout.user_id !== userId) {
            res.status(404).json({ error: 'Workout not found' });
            return;
        }
        res.json(workout);
    } catch (error) {
        console.error('Error fetching workout:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create a new workout
router.post('/', authenticateToken, async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { name, category } = req.body;

    if (!userId || !name) {
        res.status(400).json({ error: 'Name is required' });
        return;
    }

    try {
        const newWorkout = await createWorkout(userId, name, category);
        res.status(201).json(newWorkout);
    } catch (error) {
        console.error('Error creating workout:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update an existing workout
router.put('/:workoutId', authenticateToken, async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const workoutId = parseInt(req.params.workoutId, 10);
    const { name } = req.body;

    if (!userId || !name) {
        res.status(400).json({ error: 'Name is required' });
        return;
    }

    try {
        const updatedWorkout = await updateWorkout(workoutId, name);
        if (!updatedWorkout || updatedWorkout.user_id !== userId) {
            res.status(404).json({ error: 'Workout not found or unauthorized' });
            return;
        }
        res.json(updatedWorkout);
    } catch (error) {
        console.error('Error updating workout:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a workout
router.delete('/:workoutId', authenticateToken, async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const workoutId = parseInt(req.params.workoutId, 10);
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    try {
        const deletedWorkout = await deleteWorkout(workoutId);
        if (!deletedWorkout || deletedWorkout.user_id !== userId) {
            res.status(404).json({ error: 'Workout not found or unauthorized' });
            return;
        }
        res.json(deletedWorkout);
    } catch (error) {
        console.error('Error deleting workout:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;