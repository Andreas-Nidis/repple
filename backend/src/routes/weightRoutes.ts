import express, { Request, Response } from 'express';
import { authenticateFirebase } from '../middleware/authMiddleware';
import { getWeightEntries, createOrUpdateWeightEntries } from '../db/weightQueries';

const router = express.Router();
router.use(authenticateFirebase);

router.get('/weights', async(req: Request, res: Response) => {
    const userId = req.user?.id;
    const result = getWeightEntries(userId);
    res.json(result);
})

router.post('/weights', async(req: Request, res: Response) => {
    const userId = req.user?.id;
    const { weekStart, weight } = req.body;
    createOrUpdateWeightEntries(userId, weekStart, weight);
    res.sendStatus(200);
})

export default router;