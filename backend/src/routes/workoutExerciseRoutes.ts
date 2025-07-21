import express from 'express';
import { authenticateFirebase } from '../middleware/authMiddleware';
import {
  getAllExercisesInWorkout,
  getSingleExerciseInWorkout,
  addExercise,
  updateExercise,
  removeExercise
} from '../controllers/workoutExerciseController';

const router = express.Router();

router.get('/:workoutId', authenticateFirebase, getAllExercisesInWorkout);
router.get('/:workoutId/:exerciseId', authenticateFirebase, getSingleExerciseInWorkout);
router.post('/:workoutId/exercises', authenticateFirebase, addExercise);
router.put('/:workoutId/exercises/:exerciseId', authenticateFirebase, updateExercise);
router.delete('/:workoutId/exercises/:exerciseId', authenticateFirebase, removeExercise);

export default router;