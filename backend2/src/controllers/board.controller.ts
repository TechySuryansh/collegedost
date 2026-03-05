import { Request, Response } from 'express';
import { generateBoardGuide } from '../services/gemini.service';

// Generic mapping from slug to Human Readable Names
const slugToNameMap: Record<string, string> = {
    'gseb-hsc': 'GSEB HSC',
    'maharashtra-ssc': 'Maharashtra SSC',
    'karnataka-2nd-puc': 'Karnataka 2nd PUC',
    'gseb-ssc': 'GSEB SSC',
    'tamilnadu-12th': 'Tamilnadu 12th',
    'up-12th': 'UP 12th',
    'odisha-chse': 'Odisha CHSE',
    'pseb-12th': 'PSEB 12th',
    'maharashtra-hsc': 'Maharashtra HSC',
    'cbse-12th': 'CBSE 12th',
};

// @desc    Get AI-generated board guide
// @route   GET /api/boards/:slug/guide
// @access  Public
export const getBoardGuide = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            console.error('[Board Controller] Missing GEMINI_API_KEY in environment variables');
            res.status(500).json({
                success: false,
                message: 'Backend Configuration Error: Missing GEMINI_API_KEY on server.'
            });
            return;
        }

        const slug = req.params.slug as string;

        // Note: For now, we are generating it directly every time without database caching
        // To implement caching, a Board model needs to be created similarly to Exam.

        let boardName = slugToNameMap[slug];

        // Format dynamically if not mapped
        if (!boardName) {
            boardName = slug
                .split('-')
                .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')
                .replace(/\b(Hsc|Ssc|Puc|Chse|Cbse|Usp|Gseb|Pseb)\b/gi, (match: string) => match.toUpperCase());
        }

        console.log(`[Gemini] Generating guide for Board: ${boardName} (slug: ${slug})`);

        const guideData = await generateBoardGuide(boardName, slug);

        res.status(200).json({
            success: true,
            cached: false,
            data: guideData
        });
    } catch (error: any) {
        console.error('[Gemini Board Guide Error]', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate board guide. Please try again later.',
            error: error.message
        });
    }
};
