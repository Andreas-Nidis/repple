"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const workoutController_1 = require("../controllers/workoutController");
const router = express_1.default.Router();
router.get('/', authMiddleware_1.authenticateFirebase, workoutController_1.getAllWorkouts);
router.get('/:workoutId', authMiddleware_1.authenticateFirebase, workoutController_1.getWorkout);
router.post('/', authMiddleware_1.authenticateFirebase, workoutController_1.createNewWorkout);
router.put('/:workoutId', authMiddleware_1.authenticateFirebase, workoutController_1.updateExistingWorkout);
router.delete('/:workoutId', authMiddleware_1.authenticateFirebase, workoutController_1.deleteExistingWorkout);
exports.default = router;
