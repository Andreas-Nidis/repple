"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const exerciseController_1 = require("../controllers/exerciseController");
const router = express_1.default.Router();
router.get('/', authMiddleware_1.authenticateFirebase, exerciseController_1.getAllExercisesController);
router.get('/:id', authMiddleware_1.authenticateFirebase, exerciseController_1.getExerciseByIdController);
router.post('/', authMiddleware_1.authenticateFirebase, exerciseController_1.createExerciseController);
router.put('/:id', authMiddleware_1.authenticateFirebase, exerciseController_1.updateExerciseController);
router.delete('/:id', authMiddleware_1.authenticateFirebase, exerciseController_1.deleteExerciseController);
exports.default = router;
