import express from 'express';
import { authenticateFirebase } from '../middleware/authMiddleware';
import {
  getMeals,
  getMeal,
  createMealHandler,
  updateMealHandler,
  deleteMealHandler,
} from '../controllers/mealController';

const router = express.Router();

router.get('/', authenticateFirebase, getMeals);
router.get('/:mealId', authenticateFirebase, getMeal);
router.post('/', authenticateFirebase, createMealHandler);
router.put('/:mealId', authenticateFirebase, updateMealHandler);
router.delete('/:mealId', authenticateFirebase, deleteMealHandler);

export default router;
