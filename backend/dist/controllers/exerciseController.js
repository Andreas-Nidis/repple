"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllExercisesController = getAllExercisesController;
exports.getExerciseByIdController = getExerciseByIdController;
exports.createExerciseController = createExerciseController;
exports.updateExerciseController = updateExerciseController;
exports.deleteExerciseController = deleteExerciseController;
const exerciseQueries_1 = require("../db/exerciseQueries");
async function getAllExercisesController(req, res, next) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const exercises = await (0, exerciseQueries_1.getExercisesByUser)(userId);
        res.json(exercises);
    }
    catch (error) {
        next(error);
    }
}
async function getExerciseByIdController(req, res, next) {
    try {
        const exerciseId = req.params.id;
        const exercise = await (0, exerciseQueries_1.getExerciseById)(exerciseId);
        if (!exercise) {
            res.status(404).json({ error: 'Exercise not found' });
            return;
        }
        res.json(exercise);
    }
    catch (error) {
        next(error);
    }
}
async function createExerciseController(req, res, next) {
    try {
        const userId = req.user?.id;
        const { name, category, equipment, description, tutorial_url } = req.body;
        if (!name || typeof name !== 'string') {
            res.status(400).json({ error: 'Invalid input data' });
            return;
        }
        const newExercise = await (0, exerciseQueries_1.createExercise)(userId, name, category, equipment, description, tutorial_url);
        res.status(201).json(newExercise);
    }
    catch (error) {
        next(error);
    }
}
async function updateExerciseController(req, res, next) {
    try {
        const id = req.params.id;
        const { name, category, equipment, description, tutorial_url } = req.body;
        const updatedExercise = await (0, exerciseQueries_1.updateExercise)(id, name, category, equipment, description, tutorial_url);
        if (!updatedExercise) {
            res.status(404).json({ error: 'Exercise not found' });
            return;
        }
        res.json(updatedExercise);
    }
    catch (error) {
        next(error);
    }
}
async function deleteExerciseController(req, res, next) {
    try {
        const id = req.params.id;
        await (0, exerciseQueries_1.deleteExercise)(id);
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
}
