"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const workoutExerciseController_1 = require("../controllers/workoutExerciseController");
const router = express_1.default.Router();
router.get('/:workoutId', authMiddleware_1.authenticateFirebase, workoutExerciseController_1.getAllExercisesInWorkout);
router.get('/:workoutId/:exerciseId', authMiddleware_1.authenticateFirebase, workoutExerciseController_1.getSingleExerciseInWorkout);
router.post('/:workoutId/exercises', authMiddleware_1.authenticateFirebase, workoutExerciseController_1.addExercise);
router.put('/:workoutId/exercises/:exerciseId', authMiddleware_1.authenticateFirebase, workoutExerciseController_1.updateExercise);
router.delete('/:workoutId/exercises/:exerciseId', authMiddleware_1.authenticateFirebase, workoutExerciseController_1.removeExercise);
exports.default = router;
