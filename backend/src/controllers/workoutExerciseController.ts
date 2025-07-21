import { Request, Response, NextFunction } from 'express';
import {
  getExercisesInWorkout,
  getExerciseInWorkout,
  addExerciseToWorkout,
  updateExerciseInWorkout,
  removeExerciseFromWorkout
} from '../db/workoutExerciseQueries';

export async function getAllExercisesInWorkout(req: Request, res: Response, next: NextFunction) {
  const userId = req.user?.id;
  const workoutId = req.params.workoutId;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const exercises = await getExercisesInWorkout(workoutId);
    res.json(exercises);
  } catch (error) {
    next(error);
  }
}

export async function getSingleExerciseInWorkout(req: Request, res: Response, next: NextFunction) {
  const userId = req.user?.id;
  const workoutId = req.params.workoutId;
  const exerciseId = req.params.exerciseId;

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
    next(error);
  }
}

export async function addExercise(req: Request, res: Response, next: NextFunction) {
  const userId = req.user?.id;
  const workoutId = req.params.workoutId;
  const { exerciseId, sets, reps, restSeconds } = req.body;

  if (!userId || !exerciseId || !sets || !reps) {
    res.status(400).json({ error: 'Exercise ID, sets, and reps are required' });
    return;
  }

  try {
    const newExercise = await addExerciseToWorkout(workoutId, exerciseId, sets, reps, restSeconds);
    res.status(201).json(newExercise);
  } catch (error) {
    next(error);
  }
}

export async function updateExercise(req: Request, res: Response, next: NextFunction) {
  const userId = req.user?.id;
  const workoutId = req.params.workoutId;
  const exerciseId = req.params.exerciseId;
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
    next(error);
  }
}

export async function removeExercise(req: Request, res: Response, next: NextFunction) {
  const userId = req.user?.id;
  const workoutId = req.params.workoutId;
  const exerciseId = req.params.exerciseId;

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
    next(error);
  }
}