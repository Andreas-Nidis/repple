import express from 'express';
import { authenticateFirebase } from '../middleware/authMiddleware';
import {
  getAllIngredients,
  getIngredient,
  createNewIngredient,
  updateExistingIngredient,
  deleteExistingIngredient
} from '../controllers/ingredientController';

const router = express.Router();

router.get('/', authenticateFirebase, getAllIngredients);
router.get('/:ingredientId', authenticateFirebase, getIngredient);
router.post('/', authenticateFirebase, createNewIngredient);
router.put('/:ingredientId', authenticateFirebase, updateExistingIngredient);
router.delete('/:ingredientId', authenticateFirebase, deleteExistingIngredient);

export default router;
