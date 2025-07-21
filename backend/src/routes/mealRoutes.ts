import express from 'express';
import { authenticateFirebase } from '../middleware/authMiddleware';
import {
  getMeals,
  getMeal,
  getMealIngredientsHandler,
  createMealHandler,
  updateMealHandler,
  updateMealIngredientHandler,
  addIngredientHandler,
  deleteMealHandler,
  getMealSummaryHandler,
} from '../controllers/mealController';

const router = express.Router();

router.get('/', authenticateFirebase, getMeals);
router.get('/:mealId', authenticateFirebase, getMeal);
router.get('/:mealId/ingredients', authenticateFirebase, getMealIngredientsHandler);
router.post('/', authenticateFirebase, createMealHandler);
router.put('/:mealId', authenticateFirebase, updateMealHandler);
router.put('/:mealId/ingredients/:ingredientId', authenticateFirebase, updateMealIngredientHandler);
router.post('/:mealId/ingredients', authenticateFirebase, addIngredientHandler);
router.delete('/:mealId', authenticateFirebase, deleteMealHandler);
router.get('/:mealId/summary', authenticateFirebase, getMealSummaryHandler);

export default router;
