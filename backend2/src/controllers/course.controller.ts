import { Request, Response } from 'express';
import CourseEntity from '../models/Course';
import { generateCourseGuide } from '../services/gemini.service';

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
export const getCourses = async (req: Request, res: Response): Promise<void> => {
    try {
        const { level, trending } = req.query;
        const query: any = {};

        if (level && level !== 'All') {
            query.degreeLevel = level;
        }

        if (trending === 'true') {
            query.isTrending = true;
        }

        const courses = await CourseEntity.find(query).sort({ courseName: 1 });

        res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get course by slug
// @route   GET /api/courses/:slug
// @access  Public
export const getCourseBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
        const course = await CourseEntity.findOne({ slug: req.params.slug });

        if (!course) {
            res.status(404).json({ success: false, message: 'Course not found' });
            return;
        }

        res.status(200).json({
            success: true,
            data: course
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get course by ID
// @route   GET /api/courses/id/:id
// @access  Public
export const getCourseById = async (req: Request, res: Response): Promise<void> => {
    try {
        const course = await CourseEntity.findById(req.params.id);

        if (!course) {
            res.status(404).json({ success: false, message: 'Course not found' });
            return;
        }

        res.status(200).json({
            success: true,
            data: course
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create course
// @route   POST /api/courses
// @access  Private/Admin
export const createCourse = async (req: Request, res: Response): Promise<void> => {
    try {
        const course = await CourseEntity.create(req.body);

        res.status(201).json({
            success: true,
            data: course
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Admin
export const updateCourse = async (req: Request, res: Response): Promise<void> => {
    try {
        let course = await CourseEntity.findById(req.params.id);

        if (!course) {
            res.status(404).json({ success: false, message: 'Course not found' });
            return;
        }

        course = await CourseEntity.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: course
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
export const deleteCourse = async (req: Request, res: Response): Promise<void> => {
    try {
        const course = await CourseEntity.findById(req.params.id);

        if (!course) {
            res.status(404).json({ success: false, message: 'Course not found' });
            return;
        }

        await course.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get AI-generated course guide
// @route   GET /api/courses/:slug/guide
// @access  Public
export const getCourseGuide = async (req: Request, res: Response): Promise<void> => {
    try {
        const slug = req.params.slug as string;

        // Try to find the course in database
        let course = await CourseEntity.findOne({ slug: slug });

        // If course exists and has cached guide content (less than 30 days old), return it
        if (course && course.aiGuideContent && course.aiGuideGeneratedAt) {
            const daysSinceGenerated = (Date.now() - course.aiGuideGeneratedAt.getTime()) / (1000 * 60 * 60 * 24);
            if (daysSinceGenerated < 30) {
                res.status(200).json({
                    success: true,
                    cached: true,
                    data: course.aiGuideContent
                });
                return;
            }
        }

        // Derive a human-readable course name from the slug
        const courseName: string = course?.courseName || slug
            .split('-')
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
            .replace(/\b(Mba|Btech|Bca|Bba|Mca|Phd|Bed|Bsc|Msc|Mtech|Mbbs|Llb|Ca|Cs|Icwa)\b/gi, (match: string) => match.toUpperCase());

        // Generate guide content using Gemini
        console.log(`[Gemini] Generating course guide for: ${courseName} (slug: ${slug})`);
        const guideData = await generateCourseGuide(courseName, slug);

        // Try to save/cache the guide data, but don't let DB errors prevent returning data
        try {
            if (!course) {
                // Sanitize degreeLevel from Gemini response to match allowed enum values
                const validDegreeLevels = ['Undergraduate', 'Postgraduate', 'Diploma', 'Doctorate'];
                const rawLevel = guideData.highlights?.find(h => h.key.toLowerCase().includes('level'))?.value || '';
                const degreeLevel = validDegreeLevels.find(v => rawLevel.toLowerCase().includes(v.toLowerCase())) || 'Undergraduate';

                course = await CourseEntity.create({
                    courseName: courseName,
                    shortName: courseName.split(' ')[0],
                    slug: slug,
                    degreeLevel: degreeLevel,
                    duration: guideData.highlights?.find(h => h.key.toLowerCase().includes('duration'))?.value || 'TBA',
                    overview: guideData.sections?.find(s => s.id === 'overview')?.content?.replace(/<[^>]*>/g, '').substring(0, 500) || '',
                    careerOptions: [],
                    aiGuideContent: guideData,
                    aiGuideGeneratedAt: new Date()
                });
            } else {
                course.aiGuideContent = guideData;
                course.aiGuideGeneratedAt = new Date();
                await course.save();
            }
        } catch (dbError: any) {
            console.warn('[Course Guide] DB save failed, returning data anyway:', dbError.message);
        }

        res.status(200).json({
            success: true,
            cached: false,
            data: guideData
        });
    } catch (error: any) {
        console.error('[Gemini Course Guide Error]', error);
        res.status(500).json({
            success: false,
            message: `Guide generation failed: ${error.message || 'Unknown error'}`,
            error: error.message
        });
    }
};
