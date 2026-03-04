import { Request, Response } from 'express';
import YouTubeVideo from '../models/YouTubeVideo';

// @desc    Get all videos
// @route   GET /api/youtube
// @access  Public
export const getVideos = async (req: Request, res: Response): Promise<void> => {
    try {
        const { category, page = 1, limit = 10 } = req.query;
        const query: any = {};

        if (category && category !== 'All') {
            query.category = category;
        }

        const pageNum = Number(page);
        const limitNum = Number(limit);
        const skip = (pageNum - 1) * limitNum;

        const videos = await YouTubeVideo.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);

        const total = await YouTubeVideo.countDocuments(query);

        res.status(200).json({
            success: true,
            count: videos.length,
            pagination: {
                page: pageNum,
                pages: Math.ceil(total / limitNum),
                total
            },
            data: videos
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get video by ID
// @route   GET /api/youtube/:id
// @access  Public
export const getVideoById = async (req: Request, res: Response): Promise<void> => {
    try {
        const video = await YouTubeVideo.findById(req.params.id);

        if (!video) {
            res.status(404).json({ success: false, message: 'Video not found' });
            return;
        }

        res.status(200).json({
            success: true,
            data: video
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create video
// @route   POST /api/youtube
// @access  Private/Admin
export const createVideo = async (req: Request, res: Response): Promise<void> => {
    try {
        // Automatically generate thumbnail URL if not provided
        if (!req.body.thumbnail && req.body.videoId) {
            req.body.thumbnail = `https://img.youtube.com/vi/${req.body.videoId}/maxresdefault.jpg`;
        }

        const video = await YouTubeVideo.create(req.body);

        res.status(201).json({
            success: true,
            data: video
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update video
// @route   PUT /api/youtube/:id
// @access  Private/Admin
export const updateVideo = async (req: Request, res: Response): Promise<void> => {
    try {
        let video = await YouTubeVideo.findById(req.params.id);

        if (!video) {
            res.status(404).json({ success: false, message: 'Video not found' });
            return;
        }

        // Update thumbnail if videoId changed and thumbnail not explicitly updated
        if (req.body.videoId && req.body.videoId !== video.videoId && !req.body.thumbnail) {
            req.body.thumbnail = `https://img.youtube.com/vi/${req.body.videoId}/maxresdefault.jpg`;
        }

        video = await YouTubeVideo.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: video
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete video
// @route   DELETE /api/youtube/:id
// @access  Private/Admin
export const deleteVideo = async (req: Request, res: Response): Promise<void> => {
    try {
        const video = await YouTubeVideo.findById(req.params.id);

        if (!video) {
            res.status(404).json({ success: false, message: 'Video not found' });
            return;
        }

        await video.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
