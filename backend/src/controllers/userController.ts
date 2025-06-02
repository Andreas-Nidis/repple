import { Request, Response } from 'express';
import { sql } from '../db/db';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await sql.query('SELECT id, username FROM users');
    res.json(result);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};