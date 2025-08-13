import { Request, Response, NextFunction } from 'express';
import * as exerciseService from '../services/exerciseService';

export async function getAllExercisesController(req: Request, res: Response, next: NextFunction) {
  try {
    const exercises = await exerciseService.listExercises(req.user?.id!);
    res.status(200).json(exercises);
  } catch (error) {
    next(error);
  }
}

export async function getExerciseByIdController(req: Request, res: Response, next: NextFunction) {
  try {
    const exercise = await exerciseService.getSingleExercise(req.params.id);
    res.status(200).json(exercise);
  } catch (error) {
    next(error);
  }
}

export async function createExerciseController(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, category, equipment, description, tutorial_url } = req.body;
    const newExercise = await exerciseService.createNewExercise(
      req.user?.id!,
      name,
      category,
      equipment,
      description,
      tutorial_url
    );
    res.status(201).json(newExercise);
  } catch (error) {
    next(error);
  }
}

export async function updateExerciseController(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, category, equipment, description, tutorial_url } = req.body;
    const updatedExercise = await exerciseService.updateExistingExercise(
      req.params.id,
      name,
      category,
      equipment,
      description,
      tutorial_url
    );
    res.status(200).json(updatedExercise);
  } catch (error) {
    next(error);
  }
}

export async function deleteExerciseController(req: Request, res: Response, next: NextFunction) {
  try {
    await exerciseService.deleteExistingExercise(req.params.id);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}
