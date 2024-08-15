import { Request, Response } from 'express';
import Message from '../models/messageModel';

export const getContact = (req: Request, res: Response) => {
  res.json({ message: 'Contact us through this page.' });
};

export const postMessage = async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body;
    const newMessage = new Message({ name, email, message });
    await newMessage.save();
    res.status(201).json({ message: 'Message received!' });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};
