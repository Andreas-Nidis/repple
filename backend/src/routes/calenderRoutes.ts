import express from 'express';
import { authenticateFirebase } from '../middleware/authMiddleware';
import {
  getEntriesForWeekController,
  createCalendarEntryController,
  toggleCompletionController,
  deleteCalendarEntryController,
} from '../controllers/calendarController';

const router = express.Router();

router.use(authenticateFirebase);

router.get('/', getEntriesForWeekController);
router.post('/', createCalendarEntryController);
router.patch('/:id/toggle', toggleCompletionController);
router.delete('/:id', deleteCalendarEntryController);

export default router;
