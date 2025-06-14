import express from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: { 
        userId: number; 
        email: string;
        name: string;
        picture: string;
        sub: string; // Google user ID 
      };
    }
  }
}