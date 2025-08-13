import { Request, Response, NextFunction } from 'express';
import * as workoutService from '../services/workoutService';

export async function getAllWorkouts(req: Request, res: Response, next:NextFunction) {
    try {
        const workouts = await workoutService.listWorkouts(req.user?.id!);
        res.status(200).json(workouts);
    } catch (error) {
        next(error);
    }
}

export async function getWorkout(req: Request, res: Response, next:NextFunction) {
    try {
        const workout = await workoutService.getSingleWorkout(req.user?.id!, req.params.workoutId);
        res.status(200).json(workout);
    } catch (error) {
        next(error);
    }
}

export async function createNewWorkout(req: Request, res: Response, next:NextFunction) {
    try {
        const newWorkout = await workoutService.createNewWorkout(req.user?.id!, req.body.name, req.body.category);
        res.status(201).json(newWorkout);
    } catch (error) {
        next(error);
    }
}

export async function updateExistingWorkout(req: Request, res: Response, next:NextFunction) {
    try {
        const updatedWorkout = await workoutService.updateWorkoutDetails(req.user?.id!, req.params.workoutId, req.body.name);
        res.status(200).json(updatedWorkout);
    } catch (error) {
        next(error);
    }
}

export async function deleteExistingWorkout(req: Request, res: Response, next:NextFunction) {
    try {
        const deletedWorkout = await workoutService.deleteWorkoutById(req.user?.id!, req.params.workoutId)
        res.status(200).json(deletedWorkout);
    } catch (error) {
        next(error);
    }
}