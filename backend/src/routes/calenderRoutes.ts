import express from "express";
import { authenticateFirebase } from "../middleware/authMiddleware";
import {
    getEntriesForWeek,
    createCalendarEntry,
    toggleCompletion,
    deleteCalendarEntry
} from '../db/calendarQueries';

const router = express.Router();
router.use(authenticateFirebase);

router.get('/', async (req, res) => {
    const userId = req.user?.id;
    const { startDate, endDate } = req.query;

    try {
        const entries = await getEntriesForWeek(userId, String(startDate), String(endDate));
        res.json(entries);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Failed to fetch calendar entries'});
    }
});

router.post('/', async (req, res) => {
    const userId = req.user?.id;
    const { workout_id, scheduled_date } = req.body;

    try {
        const entry = await createCalendarEntry(userId, workout_id, scheduled_date);
        res.status(201).json(entry);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to create calendar entry' })
    }
})

router.patch('/:id/toggle', async (req, res) => {
    const userId = req.user?.id;
    const { id } = req.params;

    try {
        const updated = await toggleCompletion(userId, id);
        res.json(updated);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to toggle completeion' });
    }
});

router.delete('/:id', async (req, res) => {
    const userId = req.user?.id;
    const { id } = req.params;

    try {
        const deleted = await deleteCalendarEntry(userId, id);
        res.json(deleted);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to delete calendar entry' });
    }
});

export default router;
