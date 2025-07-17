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

        let result = await sql`SELECT id FROM users WHERE uid = ${decodedToken.uid}`;

        if (result.length === 0) {
            // User doesn't exist in DB — create them
            const insertResult = await sql`
                INSERT INTO users (uid, email, name, picture)
                VALUES (${decodedToken.uid}, ${decodedToken.email}, ${decodedToken.name}, ${decodedToken.picture})
                RETURNING id
            `;
            result = insertResult;
        } else {
            // User exists — check if name or picture changed, update if needed
            const user = result[0];
            if (user.name !== decodedToken.name || user.picture !== decodedToken.picture) {
                const updateResult = await sql`
                    UPDATE users
                    SET name = ${decodedToken.name}, picture = ${decodedToken.picture}
                    WHERE uid = ${decodedToken.uid}
                    RETURNING id
                `;
                result = updateResult;
            }
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