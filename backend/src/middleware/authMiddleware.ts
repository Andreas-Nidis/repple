import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  user?: { 
    userId: number; 
    email: string;
    name: string;
    picture: string;
    sub: string; // Google user ID
    };
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer token
    
    if (!token) {
        res.status(401).json({ error: 'No token provided'});
        return;
    };

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET! || 'dev-secret' ) as { userId: number; email: string; name: string; picture: string; sub: string };
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ error: 'Invalid token' });
        return;
    };
};