import { Request, Response } from 'express';
import Exam from '../models/Exam';
import { generateExamGuide, generateExamsList } from '../services/gemini.service';

// @desc    Get all exams
// @route   GET /api/exams
// @access  Public
export const getExams = async (req: Request, res: Response): Promise<void> => {
    try {
        const { level, top } = req.query;
        const query: any = {};

        if (level) {
            query.examLevel = level;
        }

        if (top === 'true') {
            query.isTop = true;
        }

        const exams = await Exam.find(query).sort({ examName: 1 });

        res.status(200).json({
            success: true,
            count: exams.length,
            data: exams
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get exam by slug
// @route   GET /api/exams/:slug
// @access  Public
export const getExamBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
        const exam = await Exam.findOne({ examSlug: req.params.slug });

        if (!exam) {
            res.status(404).json({ success: false, message: 'Exam not found' });
            return;
        }

        res.status(200).json({
            success: true,
            data: exam
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get exam by ID
// @route   GET /api/exams/id/:id
// @access  Public
export const getExamById = async (req: Request, res: Response): Promise<void> => {
    try {
        const exam = await Exam.findById(req.params.id);

        if (!exam) {
            res.status(404).json({ success: false, message: 'Exam not found' });
            return;
        }

        res.status(200).json({
            success: true,
            data: exam
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create exam
// @route   POST /api/exams
// @access  Private/Admin
export const createExam = async (req: Request, res: Response): Promise<void> => {
    try {
        const exam = await Exam.create(req.body);

        res.status(201).json({
            success: true,
            data: exam
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update exam
// @route   PUT /api/exams/:id
// @access  Private/Admin
export const updateExam = async (req: Request, res: Response): Promise<void> => {
    try {
        let exam = await Exam.findById(req.params.id);

        if (!exam) {
            res.status(404).json({ success: false, message: 'Exam not found' });
            return;
        }

        exam = await Exam.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: exam
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete exam
// @route   DELETE /api/exams/:id
// @access  Private/Admin
export const deleteExam = async (req: Request, res: Response): Promise<void> => {
    try {
        const exam = await Exam.findById(req.params.id);

        if (!exam) {
            res.status(404).json({ success: false, message: 'Exam not found' });
            return;
        }

        await exam.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get AI-generated exam guide
// @route   GET /api/exams/:slug/guide
// @access  Public
export const getExamGuide = async (req: Request, res: Response): Promise<void> => {
    try {
        const slug = req.params.slug as string;

        // Try to find the exam in database
        let exam = await Exam.findOne({ examSlug: slug });

        // If exam exists and has cached guide content (less than 30 days old), return it
        if (exam && exam.aiGuideContent && exam.aiGuideGeneratedAt) {
            const daysSinceGenerated = (Date.now() - exam.aiGuideGeneratedAt.getTime()) / (1000 * 60 * 60 * 24);
            if (daysSinceGenerated < 30) {
                res.status(200).json({
                    success: true,
                    cached: true,
                    data: exam.aiGuideContent
                });
                return;
            }
        }

        // Derive a human-readable exam name from the slug
        const examName: string = exam?.examName || slug
            .split('-')
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
            .replace(/\b(Jee|Neet|Cuet|Cet|Mht|Mah|Sat|Cfa|Amu|Iiser|Nift|Nata|Rrb|Ctet|Aiims)\b/gi, (match: string) => match.toUpperCase());

        // Generate guide content using Gemini
        console.log(`[Gemini] Generating guide for: ${examName} (slug: ${slug})`);
        const guideData = await generateExamGuide(examName, slug);

        // Auto-create exam record if it doesn't exist
        if (!exam) {
            exam = await Exam.create({
                examName: examName,
                examSlug: slug,
                conductingAuthority: guideData.highlights?.find(h => h.key.toLowerCase().includes('conducting'))?.value || 'TBA',
                examLevel: 'National',
                description: guideData.sections?.find(s => s.id === 'what-is')?.content?.replace(/<[^>]*>/g, '').substring(0, 500) || '',
                aiGuideContent: guideData,
                aiGuideGeneratedAt: new Date()
            });
        } else {
            // Update existing exam with cached content
            exam.aiGuideContent = guideData;
            exam.aiGuideGeneratedAt = new Date();
            await exam.save();
        }

        res.status(200).json({
            success: true,
            cached: false,
            data: guideData
        });
    } catch (error: any) {
        console.error('[Gemini Guide Error]', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate exam guide. Please try again later.',
            error: error.message
        });
    }
};

// In-memory cache for exams list by category
const examsListCache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

// @desc    Get exams list by category (AI-generated)
// @route   GET /api/exams/category/:category/list
// @access  Public
export const getExamsListByCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        let category = (req.params.category as string).trim();
        console.log(`[Exam Controller] Received category: "${category}"`);

        // Normalize category
        const lowerCategory = category.toLowerCase();
        if (lowerCategory === 'ssc') {
            category = 'SSC';
        } else if (lowerCategory === 'upsc') {
            category = 'UPSC';
        } else if (lowerCategory === 'psu') {
            category = 'PSU';
        } else if (lowerCategory === 'state psc') {
            category = 'State PSC';
        } else {
            category = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
        }

        console.log(`[Exam Controller] Normalized category: "${category}"`);

        // Check if it's a valid category we support
        const supportedCategories = ['Banking', 'SSC', 'Teaching', 'Defence', 'Railway', 'All', 'UPSC', 'State PSC', 'PSU', 'Insurance', 'Police', 'Scholarship', 'State'];
        if (!supportedCategories.includes(category)) {
            res.status(400).json({ success: false, message: `Category ${category} not supported yet` });
            return;
        }

        // Return cached data if available and fresh
        const cached = examsListCache[category];
        if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION_MS) {
            res.status(200).json({ success: true, cached: true, data: cached.data });
            return;
        }

        console.log(`[Exam Controller] Generating ${category} exams list via Gemini...`);
        const examsList = await generateExamsList(category);

        examsListCache[category] = { data: examsList, timestamp: Date.now() };

        res.status(200).json({ success: true, cached: false, data: examsList });
    } catch (error: any) {
        console.error(`[Exam Controller] ${req.params.category} Exams List Error:`, error.message);
        res.status(500).json({ success: false, message: error.message || `Failed to generate ${req.params.category} exams list` });
    }
};

// @desc    Get all banking exams list (AI-generated) - DEPRECATED: Use getExamsListByCategory
export const getBankingExamsList = async (req: Request, res: Response): Promise<void> => {
    req.params.category = 'Banking';
    return getExamsListByCategory(req, res);
};
