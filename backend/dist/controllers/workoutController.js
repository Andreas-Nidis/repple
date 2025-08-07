"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllWorkouts = getAllWorkouts;
exports.getWorkout = getWorkout;
exports.createNewWorkout = createNewWorkout;
exports.updateExistingWorkout = updateExistingWorkout;
exports.deleteExistingWorkout = deleteExistingWorkout;
const workoutQueries_1 = require("../db/workoutQueries");
async function getAllWorkouts(req, res, next) {
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    try {
        const workouts = await (0, workoutQueries_1.getWorkoutsByUser)(userId);
        res.json(workouts);
    }
    catch (error) {
        next(error);
    }
}
async function getWorkout(req, res, next) {
    const userId = req.user?.id;
    const workoutId = req.params.workoutId;
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    try {
        const workoutArr = await (0, workoutQueries_1.getWorkoutById)(workoutId);
        const workout = workoutArr[0];
        if (!workout || workout.user_id !== userId) {
            res.status(404).json({ error: 'Workout not found' });
            return;
        }
        res.json(workout);
    }
    catch (error) {
        next(error);
    }
}
async function createNewWorkout(req, res, next) {
    const userId = req.user?.id;
    const { name, category } = req.body;
    if (!userId || !name) {
        res.status(400).json({ error: 'Name is required' });
        return;
    }
    try {
        const newWorkout = await (0, workoutQueries_1.createWorkout)(userId, name, category);
        res.status(201).json(newWorkout);
    }
    catch (error) {
        next(error);
    }
}
async function updateExistingWorkout(req, res, next) {
    const userId = req.user?.id;
    const workoutId = req.params.workoutId;
    const { name } = req.body;
    if (!userId || !name) {
        res.status(400).json({ error: 'Name is required' });
        return;
    }
    try {
        const updatedWorkout = await (0, workoutQueries_1.updateWorkout)(workoutId, name);
        if (!updatedWorkout || updatedWorkout.user_id !== userId) {
            res.status(404).json({ error: 'Workout not found or unauthorized' });
            return;
        }
        res.json(updatedWorkout);
    }
    catch (error) {
        next(error);
    }
}
async function deleteExistingWorkout(req, res, next) {
    const userId = req.user?.id;
    const workoutId = req.params.workoutId;
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    try {
        const deletedWorkout = await (0, workoutQueries_1.deleteWorkout)(workoutId);
        if (!deletedWorkout || deletedWorkout.user_id !== userId) {
            res.status(404).json({ error: 'Workout not found or unauthorized' });
            return;
        }
        res.json(deletedWorkout);
    }
    catch (error) {
        next(error);
    }
}
