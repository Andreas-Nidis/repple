import express, { Request, Response } from 'express';
import { verifyGoogleToken } from '../auth/googleAuth';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/google-login', async (req: Request, res: Response) => {
  const { idToken } = req.body;

  if (!idToken) return res.status(400).json({ error: 'Missing idToken' });

  try {
    const googleUser = await verifyGoogleToken(idToken);

    // TODO: Check if user exists in DB, create if not

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