import express from 'express';
import type { Request, Response } from 'express'
import { findOrCreateUser } from '../db/userQueries';
import { authenticateFirebase } from '../middleware/authMiddleware';
import { DecodedIdToken, UserRecord } from 'firebase-admin/auth';

// Extend Express Request interface to include 'user'

const router = express.Router();

router.get('/me', authenticateFirebase, async (req: Request, res: Response) => {
  res.json({ user: req.user });
});

router.post('/firebase-login', authenticateFirebase, async (req: Request, res: Response) => {
  console.log('/firebase-login post route activated');
  try {
    console.log('User details', req.user);
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }
    const { uid, email, name, picture } = req.user;
    console.log('Firebase user data:', { uid, email, name, picture });

    if (!uid || !email) {
      res.status(400).json({ error: 'Invalid Firebase user data' });
      return;
    }
    console.log('Finding or creating user in database');
    // Check if user exists in DB, create if not
    const user = await findOrCreateUser(
      uid as string,
      email as string,
      name ?? '',
      picture ?? ''
    );

    res.json({ user });
    console.log('User logged in via Firebase:', user);
  } catch (error) {
    console.error('Login Error:', error);
    res.status(401).json({ error: 'Internal Server Error' });
  }
});

export default router;