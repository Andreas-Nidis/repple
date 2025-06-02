import express from 'express';
import { getUsers } from '../controllers/userController';

const router = express.Router();

router.get('/', getUsers); // GET /api/users

export default router;