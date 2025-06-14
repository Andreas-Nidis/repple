"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const exerciseQueries_1 = require("../db/exerciseQueries");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Get all exercises for a user
router.get('/', authMiddleware_1.authenticateToken, async (req, res) => {
    const userId = req.user?.userId;
    if (typeof userId !== 'number') {
        res.status(400).json({ error: 'Invalid or missing userId' });
        return;
    }
    const exercises = await (0, exerciseQueries_1.getExerciseByUser)(userId);
    res.json(exercises);
});
// Get a specific exercise by ID
router.get('/:id', authMiddleware_1.authenticateToken, async (req, res) => {
    const exerciseId = Number(req.params.id);
    const exercise = await (0, exerciseQueries_1.getExerciseById)(exerciseId);
    if (!exercise) {
        res.status(404).json({ error: 'Exercise not found' });
        return;
    }
    res.json(exercise);
});
// Create a new exercise
router.post('/', authMiddleware_1.authenticateToken, async (req, res) => {
    const userId = req.user?.userId;
    const { name, category, equipment, description, tutorial_url } = req.body;
    if (!name || typeof name !== 'string' || !userId) {
        res.status(400).json({ error: 'Invalid input data' });
        return;
    }
    const newExercise = await (0, exerciseQueries_1.createExercise)(userId, name, category, equipment, description, tutorial_url);
    res.status(201).json(newExercise);
});
// Update an existing exercise
router.put('/:id', authMiddleware_1.authenticateToken, async (req, res) => {
    const id = Number(req.params.id);
    const { name, category, equipment, description, tutorial_url } = req.body;
    const updatedExercise = await (0, exerciseQueries_1.updateExercise)(id, name, category, equipment, description, tutorial_url);
    if (!updatedExercise) {
        res.status(404).json({ error: 'Exercise not found' });
        return;
    }
    res.json(updatedExercise);
});
// Delete an exercise
router.delete('/:id', authMiddleware_1.authenticateToken, async (req, res) => {
    const id = Number(req.params.id);
    await (0, exerciseQueries_1.deleteExercise)(id);
    res.status(204).send();
});
exports.default = router;
// This file defines the routes for managing exercises in the application.
