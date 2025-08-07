"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllExercisesInWorkout = getAllExercisesInWorkout;
exports.getSingleExerciseInWorkout = getSingleExerciseInWorkout;
exports.addExercise = addExercise;
exports.updateExercise = updateExercise;
exports.removeExercise = removeExercise;
const workoutExerciseQueries_1 = require("../db/workoutExerciseQueries");
async function getAllExercisesInWorkout(req, res, next) {
    const userId = req.user?.id;
    const workoutId = req.params.workoutId;
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    try {
        const exercises = await (0, workoutExerciseQueries_1.getExercisesInWorkout)(workoutId);
        res.json(exercises);
    }
    catch (error) {
        next(error);
    }
}
async function getSingleExerciseInWorkout(req, res, next) {
    const userId = req.user?.id;
    const workoutId = req.params.workoutId;
    const exerciseId = req.params.exerciseId;
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    try {
        const exercise = await (0, workoutExerciseQueries_1.getExerciseInWorkout)(workoutId, exerciseId);
        if (!exercise) {
            res.status(404).json({ error: 'Exercise not found in this workout' });
            return;
        }
        res.json(exercise);
    }
    catch (error) {
        next(error);
    }
}
async function addExercise(req, res, next) {
    const userId = req.user?.id;
    const workoutId = req.params.workoutId;
    const { exerciseId, sets, reps, restSeconds } = req.body;
    if (!userId || !exerciseId || !sets || !reps) {
        res.status(400).json({ error: 'Exercise ID, sets, and reps are required' });
        return;
    }
    try {
        const newExercise = await (0, workoutExerciseQueries_1.addExerciseToWorkout)(workoutId, exerciseId, sets, reps, restSeconds);
        res.status(201).json(newExercise);
    }
    catch (error) {
        next(error);
    }
}
async function updateExercise(req, res, next) {
    const userId = req.user?.id;
    const workoutId = req.params.workoutId;
    const exerciseId = req.params.exerciseId;
    const { sets, reps, restSeconds } = req.body;
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    try {
        const updatedExercise = await (0, workoutExerciseQueries_1.updateExerciseInWorkout)(workoutId, exerciseId, sets, reps, restSeconds);
        if (!updatedExercise) {
            res.status(404).json({ error: 'Exercise not found in this workout' });
            return;
        }
        res.json(updatedExercise);
    }
    catch (error) {
        next(error);
    }
}
async function removeExercise(req, res, next) {
    const userId = req.user?.id;
    const workoutId = req.params.workoutId;
    const exerciseId = req.params.exerciseId;
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    try {
        const removedExercise = await (0, workoutExerciseQueries_1.removeExerciseFromWorkout)(workoutId, exerciseId);
        if (!removedExercise) {
            res.status(404).json({ error: 'Exercise not found in this workout' });
            return;
        }
        res.json(removedExercise);
    }
    catch (error) {
        next(error);
    }
}
