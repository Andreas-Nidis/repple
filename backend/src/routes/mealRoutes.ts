import express from 'express';
import { authenticateFirebase } from '../middleware/authMiddleware';
import {
  getMeals,
  getMeal,
  createMealHandler,
  updateMealHandler,
  deleteMealHandler,
  // getMealIngredientsHandler,
  // updateMealIngredientHandler,
  // addIngredientHandler,
  // getMealSummaryHandler,
} from '../controllers/mealController';

const router = express.Router();

router.get('/', authenticateFirebase, getMeals);
router.get('/:mealId', authenticateFirebase, getMeal);
router.post('/', authenticateFirebase, createMealHandler);
router.put('/:mealId', authenticateFirebase, updateMealHandler);
router.delete('/:mealId', authenticateFirebase, deleteMealHandler);
// router.get('/:mealId/ingredients', authenticateFirebase, getMealIngredientsHandler);
// router.put('/:mealId/ingredients/:ingredientId', authenticateFirebase, updateMealIngredientHandler);
// router.post('/:mealId/ingredients', authenticateFirebase, addIngredientHandler);
// router.get('/:mealId/summary', authenticateFirebase, getMealSummaryHandler);

export default router;
