import { Request, Response, NextFunction } from 'express';
import {
  getExercisesByUser,
  getExerciseById,
  createExercise,
  updateExercise,
  deleteExercise,
} from '../db/exerciseQueries';

export async function getAllExercisesController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const exercises = await getExercisesByUser(userId);
    res.json(exercises);
  } catch (error) {
    next(error);
  }
}

export async function getExerciseByIdController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const exerciseId = req.params.id;

    const exercise = await getExerciseById(exerciseId);

    if (!exercise) {
      res.status(404).json({ error: 'Exercise not found' });
      return;
    }

    res.json(exercise);
  } catch (error) {
    next(error);
  }
}

export async function createExerciseController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user?.id;
    const { name, category, equipment, description, tutorial_url } = req.body;

    if (!name || typeof name !== 'string') {
      res.status(400).json({ error: 'Invalid input data' });
      return;
    }

    const newExercise = await createExercise(userId, name, category, equipment, description, tutorial_url);

    res.status(201).json(newExercise);
  } catch (error) {
    next(error);
  }
}

export async function updateExerciseController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id;
    const { name, category, equipment, description, tutorial_url } = req.body;

    const updatedExercise = await updateExercise(id, name, category, equipment, description, tutorial_url);

    if (!updatedExercise) {
      res.status(404).json({ error: 'Exercise not found' });
      return;
    }

    res.json(updatedExercise);
  } catch (error) {
    next(error);
  }
}

export async function deleteExerciseController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id;

    await deleteExercise(id);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
