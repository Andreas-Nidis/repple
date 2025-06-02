import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  user?: { userId: number; email: string };
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer token
    
    if (!token) {
        return res.status(401).json({ error: 'No token provided'});
    };

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret' ) as { userId: number; email: string };
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid token' });
    };
};