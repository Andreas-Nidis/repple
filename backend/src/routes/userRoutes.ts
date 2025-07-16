import express from 'express';
import { getUsers } from '../controllers/userController';
import { findOrCreateUser } from '../db/userQueries';

const router = express.Router();

// router.get('/', getUsers); // GET /api/users

export default router;