import { Request, Response } from 'express';
import College from '../models/College';
import Exam from '../models/Exam';
import Course from '../models/Course';

/**
 * @desc    Unified search for colleges, exams, and courses
 * @route   GET /api/search
 * @access  Public
 */
export const unifiedSearch = async (req: Request, res: Response): Promise<void> => {
    try {
        const { q } = req.query;

        if (!q || typeof q !== 'string' || q.trim() === '') {
            res.status(200).json({
                success: true,
                data: {
                    colleges: [],
                    exams: [],
                    courses: []
                }
            });
            return;
        }

        const searchTerm = q.trim();
        const regex = new RegExp(searchTerm, 'i');

        // Parallel execution for speed
        const [colleges, exams, courses] = await Promise.all([
            College.find({ name: regex })
                .select('name slug location logo type')
                .limit(5),
            Exam.find({ examName: regex })
                .select('examName slug logoUrl conductingAuthority examLevel')
                .limit(5),
            Course.find({ name: regex })
                .select('name slug duration')
                .limit(5)
        ]);

        res.status(200).json({
            success: true,
            data: {
                colleges,
                exams,
                courses
            }
        });
    } catch (error: any) {
        console.error('Search error:', error);
        res.status(500).json({
            success: false,
            message: 'Search failed',
            error: error.message
        });
    }
};
