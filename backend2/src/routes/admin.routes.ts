import express from 'express';
import multer from 'multer';
import path from 'path';
import {
    getStats,
    getPredictorSettings,
    updatePredictorSettings,
    getSiteSettings,
    updateSiteSettings,
    ingestAicte,
    triggerNirf
} from '../controllers/admin.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        if (ext !== '.csv') {
            return cb(new Error('Only CSV files are allowed'));
        }
        cb(null, true);
    }
});

// All routes are admin-only
router.use(protect, authorize('admin'));

router.get('/stats', getStats);
router.get('/predictor-settings', getPredictorSettings);
router.put('/predictor-settings', updatePredictorSettings);
router.get('/site-settings', getSiteSettings);
router.put('/site-settings', updateSiteSettings);

// Ingestion routes
router.post('/ingest/aicte', upload.single('file'), ingestAicte);
router.post('/ingest/nirf-trigger', triggerNirf);

export default router;

