import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.message === 'Unauthorized') {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  if (err.message === 'BadRequest') {
    res.status(400).json({ error: 'Invalid data' });
    return;
  }

  if (err.message === 'NotFound') {
    res.status(404).json({ error: 'Data not found' });
    return;
  } 
  
  res.status(500).json({ error: 'Server error' });
}