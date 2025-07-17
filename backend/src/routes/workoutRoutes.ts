import express, { Request, Response } from 'express';
import { getWorkoutsByUser, getWorkoutById, createWorkout, updateWorkout, deleteWorkout } from '../db/workoutQueries';
import { authenticateFirebase } from '../middleware/authMiddleware';
import { emitToFriends } from '../socket';
import { io } from '../index';

const router = express.Router();

// Get all workouts for a user
router.get('/', authenticateFirebase, async (req: Request, res: Response) => {
    const userId = req.user?.id;
    console.log(userId);
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
router.get('/:workoutId', authenticateFirebase, async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const workoutId = req.params.workoutId;
    console.log(workoutId);
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
router.post('/', authenticateFirebase, async (req: Request, res: Response) => {
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
router.put('/:workoutId', authenticateFirebase, async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const workoutId = req.params.workoutId;
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
router.delete('/:workoutId', authenticateFirebase, async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const workoutId = req.params.workoutId;
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

router.post('/start', authenticateFirebase, async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    await emitToFriends(userId, {
        type: 'workout_started',
    }, io)

    res.status(200).send('Workout started and friends notified.');
})

router.post('/finish', authenticateFirebase, async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    await emitToFriends(userId, {
        type: 'workout_finished',
    }, io)

    res.status(200).send('Workout finished and friends notified.');
})

export default router;