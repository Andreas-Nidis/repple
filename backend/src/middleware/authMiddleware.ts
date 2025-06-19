import { Request, Response, NextFunction } from 'express';
import admin from '../utils/firebaseAdmin';
import { DecodedIdToken } from 'firebase-admin/auth';
import { sql } from '../db/db';

export interface AuthenticatedRequest extends Request {
    user?: DecodedIdToken; // Extend Request to include user information
}

export async function authenticateFirebase(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'No token provided'});
        return;
    };

    const token = authHeader.split(' ')[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);

        const result = await sql`SELECT id FROM users WHERE uid = ${decodedToken.uid}`;

        if (result.length === 0) {
            res.status(401).json({ error: 'User not found in database' });
            return;
        }

        req.user = {
            ...decodedToken,
            id: result[0].id,  // the UUID from your users table
        };

        next();
    } catch (error) {
        console.error('Error verifying Firebase token:', error);
        res.status(401).json({ error: 'Invalid Firebase token' });
        return;
    };
};