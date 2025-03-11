import express from 'express';
import { getAbout } from '../controllers/aboutController';

const router = express.Router();

router.get('/', getAbout);

export default router;
