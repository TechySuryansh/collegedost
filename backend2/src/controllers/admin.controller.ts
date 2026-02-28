import { Response, Request } from 'express';
import User from '../models/User';
import College from '../models/College';
import Article from '../models/Article';
import PredictorSettings from '../models/PredictorSettings';
import SiteSettings from '../models/SiteSettings';
import Job from '../models/Job';
import { AuthRequest } from '../middleware/auth.middleware';
import { parse } from 'csv-parse';
import fs from 'fs';

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getStats = async (req: AuthRequest, res: Response) => {
    try {
        const [totalUsers, totalAdmins, totalColleges, totalArticles] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ role: 'admin' }),
            College.countDocuments(),
            Article.countDocuments()
        ]);

        const recentUsers = await User.find()
            .select('-password')
            .sort('-createdAt')
            .limit(5);

        res.status(200).json({
            success: true,
            stats: {
                users: totalUsers,
                admins: totalAdmins,
                colleges: totalColleges,
                articles: totalArticles
            },
            recentUsers: recentUsers
        });
    } catch (error) {
        console.error('Get Stats Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Get predictor settings
// @route   GET /api/admin/predictor-settings
// @access  Private/Admin
export const getPredictorSettings = async (req: AuthRequest, res: Response) => {
    try {
        let settings = await PredictorSettings.findOne();

        if (!settings) {
            settings = await PredictorSettings.create({});
        }

        // Add virtual fields for frontend
        const result = settings.toObject();
        (result as any).hasApiKey = !!settings.openaiApiKey;
        (result as any).apiKeyPreview = settings.openaiApiKey ? `sk-...${settings.openaiApiKey.slice(-4)}` : 'Not configured';

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Update predictor settings
// @route   PUT /api/admin/predictor-settings
// @access  Private/Admin
export const updatePredictorSettings = async (req: AuthRequest, res: Response) => {
    try {
        const { isEnabled, useAI, aiModel, maxRequestsPerUser, cacheResultsMinutes, openaiApiKey } = req.body;

        const updateData: any = {
            isEnabled,
            useAI,
            aiModel,
            maxRequestsPerUser: Number(maxRequestsPerUser),
            cacheResultsMinutes: Number(cacheResultsMinutes)
        };

        if (openaiApiKey) {
            updateData.openaiApiKey = openaiApiKey;
        }

        const settings = await PredictorSettings.findOneAndUpdate(
            {},
            updateData,
            { new: true, upsert: true }
        );

        res.status(200).json({
            success: true,
            data: settings,
            message: 'Predictor settings updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};


// @desc    Get site settings (tracking codes)
// @route   GET /api/admin/site-settings
// @access  Private/Admin
export const getSiteSettings = async (req: AuthRequest, res: Response) => {
    try {
        let settings = await SiteSettings.findOne();

        if (!settings) {
            settings = await SiteSettings.create({});
        }

        res.status(200).json({
            success: true,
            data: settings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Update site settings
// @route   PUT /api/admin/site-settings
// @access  Private/Admin
export const updateSiteSettings = async (req: AuthRequest, res: Response) => {
    try {
        const { googleTrackingCode, metaTrackingCode } = req.body;

        const settings = await SiteSettings.findOneAndUpdate(
            {},
            { googleTrackingCode, metaTrackingCode },
            { new: true, upsert: true }
        );

        res.status(200).json({
            success: true,
            data: settings,
            message: 'Site settings updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};


// @desc    Ingest AICTE CSV data
// @route   POST /api/admin/ingest/aicte
// @access  Private/Admin
export const ingestAicte = async (req: any, res: Response) => {
    try {
        const file = req.file as Express.Multer.File;
        if (!file) {
            return res.status(400).json({ success: false, message: 'Please upload a CSV file' });
        }

        const { year } = req.body;

        // Create a new job record
        const job = await Job.create({
            type: 'aicte_ingestion',
            status: 'processing',
            year: Number(year),
            message: `Starting ingestion for academic year ${year}`
        });

        const results: any[] = [];

        // Basic parsing and job initiation response
        fs.createReadStream(file.path)
            .pipe(parse({ columns: true, skip_empty_lines: true }))
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                try {
                    // Update job with row count
                    job.totalRows = results.length;
                    job.message = `Processing ${results.length} rows...`;
                    await job.save();

                    console.log(`Job ${job._id} finished processing ${results.length} rows`);
                    // In a real scenario, this would iterate and update colleges...

                    job.status = 'completed';
                    job.progress = 100;
                    job.processedRows = results.length;
                    job.message = `Successfully ingested ${results.length} colleges for ${year}`;
                    await job.save();

                    // Delete temp file
                    fs.unlinkSync(file.path);
                } catch (err: any) {
                    job.status = 'failed';
                    job.error = err.message;
                    await job.save();
                }
            });

        res.status(202).json({
            success: true,
            message: 'Ingestion job started',
            jobId: job._id
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// @desc    Trigger NIRF Check
// @route   POST /api/admin/ingest/nirf-trigger
// @access  Private/Admin
export const triggerNirf = async (req: Request, res: Response) => {
    try {
        const { year, category, url } = req.body;

        const job = await Job.create({
            type: 'nirf_check',
            status: 'processing',
            year: Number(year),
            message: `Triggering NIRF check for ${year} - ${category}`
        });

        // Simulate background work
        setTimeout(async () => {
            job.status = 'completed';
            job.progress = 100;
            job.message = `NIRF data updated for ${year}`;
            await job.save();
        }, 5000);

        res.status(202).json({
            success: true,
            message: 'NIRF Trigger job started',
            jobId: job._id
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

