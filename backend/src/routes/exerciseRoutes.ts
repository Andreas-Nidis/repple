import express from 'express';
import { authenticateFirebase } from '../middleware/authMiddleware';
import {
  getAllExercisesController,
  getExerciseByIdController,
  createExerciseController,
  updateExerciseController,
  deleteExerciseController,
} from '../controllers/exerciseController';

const router = express.Router();

router.get('/', authenticateFirebase, getAllExercisesController);
router.get('/:id', authenticateFirebase, getExerciseByIdController);
router.post('/', authenticateFirebase, createExerciseController);
router.put('/:id', authenticateFirebase, updateExerciseController);
router.delete('/:id', authenticateFirebase, deleteExerciseController);

export default router;
