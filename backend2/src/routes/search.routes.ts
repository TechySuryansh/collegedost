import express from 'express';
import { unifiedSearch } from '../controllers/search.controller';

const router = express.Router();

router.get('/', unifiedSearch);

export default router;
