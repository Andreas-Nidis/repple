import express from 'express';
import { authenticateFirebase } from '../middleware/authMiddleware';
import { getCurrentUserController, loginController } from '../controllers/authController';

const router = express.Router();

router.get('/me', authenticateFirebase, getCurrentUserController);
router.post('/login', authenticateFirebase, loginController);

export default router;
