import express from 'express';
import { authenticateFirebase } from '../middleware/authMiddleware';
import {
  getAllWeightEntries,
  createWeightEntryHandler,
  updateWeightEntryHandler,
  deleteWeightEntryHandler
} from '../controllers/weightController';

const router = express.Router();
router.use(authenticateFirebase);

router.get('/', getAllWeightEntries);
router.post('/', createWeightEntryHandler);
router.put('/:entryDate', updateWeightEntryHandler);
router.delete('/:entryDate', deleteWeightEntryHandler);

export default router;