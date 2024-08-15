import { Request, Response } from 'express';

export const getAbout = (req: Request, res: Response) => {
  res.json({ message: 'This is the About Page. Learn more about us here.' });
};
