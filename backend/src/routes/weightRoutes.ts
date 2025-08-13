import express from 'express';
import { authenticateFirebase } from '../middleware/authMiddleware';
import {
  getAllWeightEntries,
  createWeightEntry,
  updateWeightEntry,
  deleteWeightEntry
} from '../controllers/weightController';

const router = express.Router();
router.use(authenticateFirebase);

router.get('/', getAllWeightEntries);
router.post('/', createWeightEntry);
router.put('/:entryDate', updateWeightEntry);
router.delete('/:entryDate', deleteWeightEntry);

export default router;