import express from 'express';
import type { Request, Response } from 'express'
import { verifyGoogleToken } from '../auth/googleAuth';
import jwt from 'jsonwebtoken';
import { findOrCreateUser } from '../db/userQueries';
import { authenticateToken } from '../middleware/authMiddleware';

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const router = express.Router();

router.get('/me', authenticateToken, async (req: Request, res: Response) => {
  const user = req.user;;
  res.json({ user });
});

router.post('/google-login', async (req: Request, res: Response) => {
  const { idToken } = req.body;

  if (!idToken) {
    res.status(400).json({ error: 'Missing idToken' });
    return;
  };

  try {
    const googleUser = await verifyGoogleToken(idToken);

    if (!googleUser.sub || !googleUser.email) {
      res.status(400).json({ error: 'Invalid Google user data' });
      return;
    }

    // Check if user exists in DB, create if not
    const user = await findOrCreateUser(
      googleUser.sub as string,
      googleUser.email as string,
      googleUser.picture ?? '',
      googleUser.name ?? ''
    );

    // Create JWT for your app (adjust secret & payload)
    const token = jwt.sign(
      { email: googleUser.email, sub: googleUser.sub },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.json({ token, user: googleUser });
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Invalid Google token' });
  }
});

export default router;