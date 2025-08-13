import { Request, Response, NextFunction } from 'express';
import * as workoutExerciseService from '../services/workoutExerciseService';

export async function getAllExercisesInWorkout(req: Request, res: Response, next: NextFunction) {
  try {
    const exercises = await workoutExerciseService.listExercises(req.user?.id!, req.params.workoutId);
    res.status(200).json(exercises);
  } catch (error) {
    next(error);
  }
}

export async function getSingleExerciseInWorkout(req: Request, res: Response, next: NextFunction) {
  try {
    const exercise = await workoutExerciseService.getSingleExercise(
      req.user?.id!, 
      req.params.workoutId, 
      req.params.exerciseId
    );
    res.status(200).json(exercise);
  } catch (error) {
    next(error);
  }
}

export async function addExercise(req: Request, res: Response, next: NextFunction) {
  try {
    const { sets, reps, restSeconds } = req.body;
    const newExercise = await workoutExerciseService.addNewExercise(
      req.user?.id!, 
      req.params.workoutId, 
      req.body.exerciseId, 
      sets, 
      reps, 
      restSeconds
    );
    res.status(201).json(newExercise);
  } catch (error) {
    next(error);
  }
}

export async function updateExercise(req: Request, res: Response, next: NextFunction) {
  try {
    const { sets, reps, restSeconds } = req.body;
    const updatedExercise = await workoutExerciseService.updateExerciseDetails(
      req.user?.id!, 
      req.params.workoutId, 
      req.params.exerciseId, 
      sets, 
      reps, 
      restSeconds
    );
    res.status(200).json(updatedExercise);
  } catch (error) {
    next(error);
  }
}

export async function removeExercise(req: Request, res: Response, next: NextFunction) {
  try {
    const removedExercise = await workoutExerciseService.removeExerciseById(
      req.user?.id!, 
      req.params.workoutId, 
      req.params.exerciseId
    );
    res.status(200).json(removedExercise);
  } catch (error) {
    next(error);
  }
}