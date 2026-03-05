import express from 'express';
import { getBoardGuide } from '../controllers/board.controller';

const router = express.Router();

router.get('/:slug/guide', getBoardGuide);

export default router;
