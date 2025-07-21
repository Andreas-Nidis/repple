import express from 'express';
import { authenticateFirebase } from '../middleware/authMiddleware';
import {
  getMealIngredients,
  addIngredient,
  updateIngredient,
  removeIngredient
} from '../controllers/mealIngredientsController';

const router = express.Router();

router.get('/:mealId', authenticateFirebase, getMealIngredients);
router.post('/:mealId/:ingredientId', authenticateFirebase, addIngredient);
router.put('/:mealId/:ingredientId', authenticateFirebase, updateIngredient);
router.delete('/:mealId/:ingredientId', authenticateFirebase, removeIngredient);

export default router;
