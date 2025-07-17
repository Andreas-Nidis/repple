import express from 'express';
import type { Request, Response } from 'express'
import { findUser } from '../db/userQueries';
import { authenticateFirebase } from '../middleware/authMiddleware';
import { DecodedIdToken, UserRecord } from 'firebase-admin/auth';

// Extend Express Request interface to include 'user'

const router = express.Router();

router.get('/me', authenticateFirebase, async (req: Request, res: Response) => {
  res.json({ user: req.user });
});

router.post('/login', authenticateFirebase, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }
    const { uid, email, name, picture } = req.user;

    if (!uid || !email) {
      res.status(400).json({ error: 'Invalid Firebase user data' });
      return;
    }

    console.log('Finding user in database');
    // Check if user exists in DB
    const user = await findUser(
      uid as string,
      email as string,
      name as string,
      picture as string,
    );

    res.json({ user });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(401).json({ error: 'Internal Server Error' });
  }
});

export default router;