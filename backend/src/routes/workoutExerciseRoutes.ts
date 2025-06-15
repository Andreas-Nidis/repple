import express, { Request, Response } from 'express';
import { getExercisesInWorkout, getExerciseInWorkout, addExerciseToWorkout, updateExerciseInWorkout, removeExerciseFromWorkout } from '../db/workoutExerciseQueries';
import { authenticateFirebase } from '../middleware/authMiddleware';

const router = express.Router();

// Get all exercises in a workout
router.get('/:workoutId/exercises', authenticateFirebase, async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const workoutId = parseInt(req.params.workoutId, 10);
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    try {
        const exercises = await getExercisesInWorkout(workoutId);
        res.json(exercises);
    } catch (error) {
        console.error('Error fetching exercises:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get a specific exercise in a workout
router.get('/:workoutId/exercises/:exerciseId', authenticateFirebase, async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const workoutId = parseInt(req.params.workoutId, 10);
    const exerciseId = parseInt(req.params.exerciseId, 10);
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    try {
        const exercise = await getExerciseInWorkout(workoutId, exerciseId);
        if (!exercise) {
            res.status(404).json({ error: 'Exercise not found in this workout' });
            return;
        }
        res.json(exercise);
    } catch (error) {
        console.error('Error fetching exercise:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add an exercise to a workout
router.post('/:workoutId/exercises', authenticateFirebase, async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const workoutId = parseInt(req.params.workoutId, 10);
    const { exerciseId, sets, reps, restSeconds } = req.body;

    if (!userId || !exerciseId || !sets || !reps) {
        res.status(400).json({ error: 'Exercise ID, sets, and reps are required' });
        return;
    }

    try {
        const newExercise = await addExerciseToWorkout(workoutId, exerciseId, sets, reps, restSeconds);
        res.status(201).json(newExercise);
    } catch (error) {
        console.error('Error adding exercise:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update an exercise in a workout
router.put('/:workoutId/exercises/:exerciseId', authenticateFirebase, async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const workoutId = parseInt(req.params.workoutId, 10);
    const exerciseId = parseInt(req.params.exerciseId, 10);
    const { sets, reps, restSeconds } = req.body;

    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    try {
        const updatedExercise = await updateExerciseInWorkout(workoutId, exerciseId, sets, reps, restSeconds);
        if (!updatedExercise) {
            res.status(404).json({ error: 'Exercise not found in this workout' });
            return;
        }
        res.json(updatedExercise);
    } catch (error) {
        console.error('Error updating exercise:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Remove an exercise from a workout
router.delete('/:workoutId/exercises/:exerciseId', authenticateFirebase, async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const workoutId = parseInt(req.params.workoutId, 10);
    const exerciseId = parseInt(req.params.exerciseId, 10);
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    try {
        const removedExercise = await removeExerciseFromWorkout(workoutId, exerciseId);
        if (!removedExercise) {
            res.status(404).json({ error: 'Exercise not found in this workout' });
            return;
        }
        res.json(removedExercise);
    } catch (error) {
        console.error('Error removing exercise:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;