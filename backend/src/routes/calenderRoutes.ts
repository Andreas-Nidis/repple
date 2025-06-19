import express from "express";
import { authenticateFirebase } from "../middleware/authMiddleware";
import {
    getEntriesForWeek,
    createCalenderEntry,
    toggleCompletion
} from '../db/calenderQueries';

const router = express.Router();
router.use(authenticateFirebase);

router.get('/', async (req, res) => {
    const userId = req.user?.id;
    console.log('Calender userId: ', userId);
    const { startDate, endDate } = req.query;

    try {
        const entries = await getEntriesForWeek(userId, String(startDate), String(endDate));
        res.json(entries);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Failed to fetch calender entries'});
    }
});

router.post('/', async (req, res) => {
    const userId = req.user?.id;
    const { workout_id, scheduled_date } = req.body;

    try {
        const entry = await createCalenderEntry(userId, workout_id, scheduled_date);
        res.status(201).json(entry);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to create calender entry' })
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

export default router;
