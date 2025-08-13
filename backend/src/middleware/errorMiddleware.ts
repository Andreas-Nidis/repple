import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err.message === 'Unauthorized') return res.status(401).json({ error: 'Unauthorized' });
  if (err.message === 'BadRequest') return res.status(400).json({ error: 'Invalid data' });
  if (err.message === 'NotFound') return res.status(404).json({ error: 'Data not found' });
  res.status(500).json({ error: 'Server error' });
}