import express from 'express';
import { authenticateFirebase } from '../middleware/authMiddleware';
import {
  getMeals,
  getMeal,
  createMeal,
  updateMeal,
  deleteMeal,
} from '../controllers/mealController';

const router = express.Router();

router.get('/', authenticateFirebase, getMeals);
router.get('/:mealId', authenticateFirebase, getMeal);
router.post('/', authenticateFirebase, createMeal);
router.put('/:mealId', authenticateFirebase, updateMeal);
router.delete('/:mealId', authenticateFirebase, deleteMeal);

export default router;
