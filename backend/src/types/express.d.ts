import express from 'express';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';
import { DecodedIdToken } from 'firebase-admin/auth';


declare global {
  namespace Express {
    interface Request {
      user?: DecodedIdToken // Extend Request to include user information
    }
  }
}

