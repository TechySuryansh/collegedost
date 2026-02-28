import express, { Request, Response } from 'express';
import SiteSettings from '../models/SiteSettings';

const router = express.Router();

// @desc    Get public site settings (tracking codes)
// @route   GET /api/site/settings
// @access  Public
router.get('/settings', async (req: Request, res: Response) => {
    try {
        const settings = await SiteSettings.findOne().select('googleTrackingCode metaTrackingCode');

        res.status(200).json({
            success: true,
            data: settings || { googleTrackingCode: '', metaTrackingCode: '' }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
});

export default router;
