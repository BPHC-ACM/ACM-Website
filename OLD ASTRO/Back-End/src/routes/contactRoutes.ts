import express from 'express';
import { getContact, postMessage } from '../controllers/contactController';

const router = express.Router();

router.get('/', getContact);
router.post('/', postMessage);

export default router;
