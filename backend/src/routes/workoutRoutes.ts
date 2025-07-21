import express from 'express';
import { authenticateFirebase } from '../middleware/authMiddleware';
import { 
    getAllWorkouts, 
    getWorkout,
    createNewWorkout,
    updateExistingWorkout,
    deleteExistingWorkout,
} from '../controllers/workoutController';

const router = express.Router();

router.get('/', authenticateFirebase, getAllWorkouts);
router.get('/:workoutId', authenticateFirebase, getWorkout);
router.post('/', authenticateFirebase, createNewWorkout);
router.put('/:workoutId', authenticateFirebase, updateExistingWorkout);
router.delete('/:workoutId', authenticateFirebase, deleteExistingWorkout);

export default router;