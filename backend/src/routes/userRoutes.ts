import express from 'express';
import { authenticateFirebase } from '../middleware/authMiddleware';
import {
    getUsersHandler,
} from '../controllers/userController';

const router = express.Router();

router.get('/', authenticateFirebase, getUsersHandler)

export default router;