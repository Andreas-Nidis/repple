import express from 'express';
import { authenticateFirebase } from '../middleware/authMiddleware';
import { getWeightEntries, createWeightEntry, updateWeightEntry, deleteWeightEntries } from '../db/weightQueries';

const router = express.Router();
router.use(authenticateFirebase);

router.get('/', async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return
    }

    const result = await getWeightEntries(userId);
    res.json(result);
})

router.post('/', async (req, res) => {
    const userId = req.user?.id;
    const { entryDate, weight } = req.body;

    if (!userId || !entryDate || !weight) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }
    
    await createWeightEntry(userId, entryDate, weight);
    res.sendStatus(200);
})

router.put('/:entryDate', async (req, res) => {
    const userId = req.user?.id;
    const { entryDate } = req.params;
    const { weight } = req.body;

    if (!userId || !entryDate || !weight) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }

    await updateWeightEntry(userId, entryDate, weight);
    res.sendStatus(200);
})

router.delete('/:entryDate', async (req, res) => {
    try {
        const { entryDate } = req.params;
        const userId = req.user?.id;

        if (!userId || !entryDate) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }

        console.log("Starting to delete weight ", entryDate)

        await deleteWeightEntries(userId, entryDate);
        res.status(200).json({ message: 'Weight entry deleted successfully.' });
    } catch (error) {
        console.error('Error deleting weight:', error);
        res.status(500).json({ message: 'Server error.' });
    }
})

export default router;