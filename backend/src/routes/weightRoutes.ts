import express from 'express';
import { authenticateFirebase } from '../middleware/authMiddleware';
import { getWeightEntries, createOrUpdateWeightEntries } from '../db/weightQueries';

const router = express.Router();
router.use(authenticateFirebase);

router.get('/', async (req, res) => {
    // console.log(req.user);
    const userId = req.user?.id;
    // console.log(userId);
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return
    }

    const result = await getWeightEntries(userId);
    res.json(result);
})

router.post('/', async(req, res) => {
    const userId = req.user?.id;
    const { weekStart, weight } = req.body;

    if (!userId || !weekStart || !weight) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }
    
    await createOrUpdateWeightEntries(userId, weekStart, weight);
    res.sendStatus(200);
})

export default router;