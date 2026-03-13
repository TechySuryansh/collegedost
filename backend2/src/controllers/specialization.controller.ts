import { Request, Response } from 'express';
import Specialization from '../models/Specialization';
import { generateSpecializationGuide } from '../services/gemini.service';

// @desc    Get specialization guide by slug
// @route   GET /api/colleges/specialization/:slug
// @access  Public
export const getSpecializationGuide = async (req: Request, res: Response): Promise<void> => {
    try {
        const slug = req.params.slug as string;

        // Try to find in database
        let spec = await Specialization.findOne({ slug });

        // Cache check (30 days)
        if (spec && spec.details && spec.generatedAt) {
            const daysSinceGenerated = (Date.now() - spec.generatedAt.getTime()) / (1000 * 60 * 60 * 24);
            if (daysSinceGenerated < 30) {
                res.status(200).json({
                    success: true,
                    cached: true,
                    data: spec.details
                });
                return;
            }
        }

        // Derive name from slug
        const specName = slug
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        console.log(`[Gemini] Generating specialization guide for: ${specName} (slug: ${slug})`);
        const guideData = await generateSpecializationGuide(specName, slug);

        // Update or create in DB
        if (!spec) {
            spec = await Specialization.create({
                name: specName,
                slug: slug,
                stream: 'Engineering',
                details: guideData,
                generatedAt: new Date()
            });
        } else {
            spec.details = guideData;
            spec.generatedAt = new Date();
            await spec.save();
        }

        res.status(200).json({
            success: true,
            cached: false,
            data: guideData
        });
    } catch (error: any) {
        console.error('[Gemini Specialization Guide Error]', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate specialization guide. Please try again later.',
            error: error.message
        });
    }
};
