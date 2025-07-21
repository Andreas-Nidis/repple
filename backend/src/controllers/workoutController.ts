import { Request, Response, NextFunction } from 'express';
import {
    getWorkoutsByUser,
    getWorkoutById,
    createWorkout,
    updateWorkout,
    deleteWorkout
} from '../db/workoutQueries';

export async function getAllWorkouts(req: Request, res: Response, next:NextFunction) {
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    try {
        const workouts = await getWorkoutsByUser(userId);
        res.json(workouts);
    } catch (error) {
        next(error);
    }
}

export async function getWorkout(req: Request, res: Response, next:NextFunction) {
    const userId = req.user?.id;
    const workoutId = req.params.workoutId;

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
        next(error);
    }
}

export async function createNewWorkout(req: Request, res: Response, next:NextFunction) {
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
        next(error);
    }
}

export async function updateExistingWorkout(req: Request, res: Response, next:NextFunction) {
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
        next(error);
    }
}

export async function deleteExistingWorkout(req: Request, res: Response, next:NextFunction) {
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
        next(error);
    }
}