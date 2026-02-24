import { Request, Response } from 'express';
import Prediction from '../models/Prediction';
import College from '../models/College';
import Exam from '../models/Exam';
import RankTrend from '../models/RankTrend';

// @desc    Predict colleges based on JEE Main Percentile
// @route   POST /api/predictor/predict-by-percentile
// @access  Public
export const predictByPercentile = async (req: Request, res: Response): Promise<void> => {
    try {
        const { percentile, rank, category, homeState, gender, exam = 'JEE Main' } = req.body;

        if ((!percentile && !rank) || !category || !homeState || !gender) {
            res.status(400).json({ success: false, message: 'Please provide all details (percentile or rank, category, homeState, gender)' });
            return;
        }

        // If rank is directly provided, use it; otherwise calculate from percentile
        let expectedRank: number;
        if (rank) {
            expectedRank = Number(rank);
        } else {
            // Logic to calculate expected rank from percentile (approximate)
            // Total candidates ~12 Lakhs
            const totalCandidates = 1200000;
            expectedRank = Math.floor((100 - percentile) * totalCandidates / 100);
        }

        // Fetch colleges based on cutoffs
        // We will categorize them into Good, May Get, Tough

        // Good: Closing Rank > Rank * 1.2
        // May Get: Closing Rank between Rank * 0.8 and Rank * 1.2
        // Tough: Closing Rank < Rank * 0.8

        const colleges = await College.find({
            cutoffs: {
                $elemMatch: {
                    exam: exam,
                    category: category
                }
            }
        }).select('name location type cutoffs coursesOffered');

        const results: Record<string, Record<string, any[]>> = {
            NITs: { good_chances: [], may_get: [], tough_chances: [] },
            IIITs: { good_chances: [], may_get: [], tough_chances: [] },
            GFTIs: { good_chances: [], may_get: [], tough_chances: [] },
            Private_Deemed: { good_chances: [], may_get: [], tough_chances: [] }
        };

        const summary: Record<string, number> = { good_chances: 0, may_get: 0, tough_chances: 0 };

        for (const college of colleges) {
            // Find best matching cutoff for this user
            // In reality, we should match by state quota (HS vs OS)
            // matchingCutoff = college.cutoffs.find(...)

            // For now, simplify: use the max closing rank for the category
            // TODO: Refine this with Home State logic
            const relevantCutoffs = college.cutoffs.filter(c => c.exam === exam && c.category === category);
            if (!relevantCutoffs.length) continue;

            // Take the best branch (highest closing rank) just for eligibility check
            // or iterate all branches

            for (const seat of relevantCutoffs) {
                const closingRank = seat.closingRank;
                let chanceType = '';

                if (closingRank > expectedRank * 1.1) chanceType = 'good_chances';
                else if (closingRank > expectedRank * 0.9) chanceType = 'may_get';
                else chanceType = 'tough_chances';

                const collegeType = determineCollegeType(college.name, college.type); // Helper to categorize into NIT/IIIT etc.

                // Add to results
                // Avoid duplicates if multiple branches match? 
                // Front end expects list of colleges with "course" field.

                const entry = {
                    college_name: college.name,
                    course: seat.branch,
                    quota: 'AI', // Defaulting to All India for simplicity
                    ownership: college.type,
                    last_year_cutoff: closingRank,
                    fees: college.coursesOffered[0]?.fee ? `₹${(college.coursesOffered[0].fee / 100000).toFixed(1)}L` : 'N/A'
                };

                if (results[collegeType]) {
                    results[collegeType][chanceType].push(entry);
                    summary[chanceType]++;
                }
            }
        }

        // Save prediction? Optional.
        const newPrediction = await Prediction.create({
            input: { percentile, category, homeState, gender, exam },
            results: results, // Note: This might be large
            // user: req.user.id // if authenticated
        });

        res.status(200).json({
            success: true,
            predictionId: newPrediction._id,
            input: newPrediction.input,
            estimated_rank: expectedRank,
            summary,
            results,
            iit_eligibility: {
                eligible_for_jee_advanced: percentile > 90, // Rough check
                note: percentile > 90 ? "You are likely eligible." : "You might miss the cutoff."
            }
        });

    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Predict Medical Colleges based on NEET Score
 * @route   POST /api/predictor/neet-predict
 * @access  Public
 */
export const neetPredict = async (req: Request, res: Response): Promise<void> => {
    try {
        const { score, category, homeState, gender } = req.body;

        if (!score || !category || !homeState || !gender) {
            res.status(400).json({ success: false, message: 'Please provide all details' });
            return;
        }

        // 1. Estimate Rank from NEET Score
        // 2024-2025 rough estimates (NEET is highly competitive)
        let estimatedRank = 0;
        const s = Number(score);
        if (s >= 715) estimatedRank = Math.floor(Math.random() * 50) + 1;
        else if (s >= 700) estimatedRank = Math.floor((720 - s) * 200) + 50;
        else if (s >= 680) estimatedRank = Math.floor((700 - s) * 500) + 2000;
        else if (s >= 650) estimatedRank = Math.floor((680 - s) * 1000) + 12000;
        else if (s >= 600) estimatedRank = Math.floor((650 - s) * 1500) + 42000;
        else if (s >= 550) estimatedRank = Math.floor((600 - s) * 2000) + 117000;
        else if (s >= 500) estimatedRank = Math.floor((550 - s) * 3000) + 217000;
        else estimatedRank = Math.floor((500 - s) * 5000) + 367000;

        // 2. Fetch Colleges with NEET cutoffs
        const colleges = await College.find({
            cutoffs: {
                $elemMatch: {
                    exam: 'NEET',
                    category: category
                }
            }
        }).select('name location type cutoffs coursesOffered');

        const results: Record<string, Record<string, any[]>> = {
            AIIMS: { good_chances: [], may_get: [], tough_chances: [] },
            JIPMER: { good_chances: [], may_get: [], tough_chances: [] },
            Government_Medical: { good_chances: [], may_get: [], tough_chances: [] },
            Private_Medical: { good_chances: [], may_get: [], tough_chances: [] },
            Dental: { good_chances: [], may_get: [], tough_chances: [] }
        };

        const summary: Record<string, number> = { good_chances: 0, may_get: 0, tough_chances: 0 };

        for (const college of colleges) {
            const relevantCutoffs = college.cutoffs.filter(c => c.exam === 'NEET' && c.category === category);
            if (!relevantCutoffs.length) continue;

            for (const seat of relevantCutoffs) {
                const closingRank = seat.closingRank;
                let chanceType = '';

                if (closingRank > estimatedRank * 1.15) chanceType = 'good_chances';
                else if (closingRank > estimatedRank * 0.85) chanceType = 'may_get';
                else chanceType = 'tough_chances';

                const medicalType = determineMedicalCollegeType(college.name, college.type, seat.branch);

                const entry = {
                    college_name: college.name,
                    course: seat.branch,
                    state: college.location.state,
                    quota: 'All India',
                    last_year_cutoff: closingRank,
                    fees: college.coursesOffered[0]?.fee ? `₹${(college.coursesOffered[0].fee / 1000).toFixed(0)}K` : 'Contact College'
                };

                if (results[medicalType]) {
                    results[medicalType][chanceType].push(entry);
                    summary[chanceType]++;
                }
            }
        }

        // 3. Save Prediction
        const newPrediction = await Prediction.create({
            input: { score, category, homeState, gender, exam: 'NEET' },
            results: results
        });

        res.status(200).json({
            success: true,
            predictionId: newPrediction._id,
            input: newPrediction.input,
            estimated_rank: estimatedRank,
            summary,
            results
        });

    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Get NEET prediction by ID
 * @route   GET /api/predictor/neet-prediction/:id
 * @access  Public
 */
export const getNeetPredictionById = async (req: Request, res: Response): Promise<void> => {
    try {
        const prediction = await Prediction.findById(req.params.id);
        if (!prediction || prediction.input.exam !== 'NEET') {
            res.status(404).json({ success: false, message: 'NEET Prediction not found' });
            return;
        }
        res.status(200).json({ success: true, ...prediction.toObject() });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Helper function
function determineCollegeType(name: string, type: string): string {
    if (name.includes('National Institute of Technology') || name.includes('NIT')) return 'NITs';
    if (name.includes('Indian Institute of Information Technology') || name.includes('IIIT')) return 'IIITs';
    if (type === 'Government') return 'GFTIs';
    return 'Private_Deemed';
}

function determineMedicalCollegeType(name: string, type: string, branch: string): string {
    const uppercaseName = name.toUpperCase();
    if (uppercaseName.includes('AIIMS') || uppercaseName.includes('ALL INDIA INSTITUTE OF MEDICAL SCIENCES')) return 'AIIMS';
    if (uppercaseName.includes('JIPMER')) return 'JIPMER';
    if (branch === 'BDS' || branch.includes('Dental')) return 'Dental';
    if (type === 'Government') return 'Government_Medical';
    return 'Private_Medical';
}

// @desc    Get prediction by ID
// @route   GET /api/predictor/prediction/:id
// @access  Public
export const getPredictionById = async (req: Request, res: Response): Promise<void> => {
    try {
        const prediction = await Prediction.findById(req.params.id);
        if (!prediction) {
            res.status(404).json({ success: false, message: 'Prediction not found' });
            return;
        }
        res.status(200).json({ success: true, ...prediction.toObject() });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Predict Rank based on Score and Exam
 * @route   POST /api/predictor/predict-rank
 * @access  Public
 */
export const predictRank = async (req: Request, res: Response): Promise<void> => {
    try {
        const { score, exam } = req.body;

        if (!score || !exam) {
            res.status(400).json({ success: false, message: 'Please provide score and exam' });
            return;
        }

        const scoreNum = Number(score);

        // Find trends for this exam, sorted by score descending
        const trends = await RankTrend.find({ exam }).sort({ score: -1 });

        if (trends.length === 0) {
            // Fallback to simple mock logic if no data exists yet
            const mockRank = Math.floor(1000000 / (scoreNum + 1));
            res.status(200).json({
                success: true,
                rank: mockRank,
                is_mock: true,
                message: 'Using estimated mock logic as no trend data found'
            });
            return;
        }

        // Simple interpolation/closest match logic
        let predictedRank = 0;

        // Find the boundary points
        let upper = trends.find(t => t.score >= scoreNum);
        let lower = [...trends].reverse().find(t => t.score <= scoreNum);

        if (upper && lower && upper._id !== lower._id) {
            // Linear interpolation
            const x = scoreNum;
            const x1 = lower.score;
            const x2 = upper.score;
            const y1 = lower.rank;
            const y2 = upper.rank;

            predictedRank = Math.round(y1 + ((x - x1) * (y2 - y1) / (x2 - x1)));
        } else if (upper) {
            predictedRank = upper.rank;
        } else if (lower) {
            predictedRank = lower.rank;
        }

        res.status(200).json({
            success: true,
            rank: predictedRank,
            exam,
            score: scoreNum
        });

    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
