import { Request, Response } from 'express';
import Prediction from '../models/Prediction';
import College from '../models/College';
import Exam from '../models/Exam';
import RankTrend from '../models/RankTrend';

// Helper functions
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

        let expectedRank: number;
        if (rank) {
            expectedRank = Number(rank);
        } else {
            const totalCandidates = 1200000;
            expectedRank = Math.floor((100 - percentile) * totalCandidates / 100);
        }

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
            const relevantCutoffs = college.cutoffs.filter(c => c.exam === exam && c.category === category);
            if (!relevantCutoffs.length) continue;

            for (const seat of relevantCutoffs) {
                const closingRank = seat.closingRank;
                let chanceType = '';

                if (closingRank > expectedRank * 1.1) chanceType = 'good_chances';
                else if (closingRank > expectedRank * 0.9) chanceType = 'may_get';
                else chanceType = 'tough_chances';

                const collegeType = determineCollegeType(college.name, college.type);

                const entry = {
                    college_name: college.name,
                    course: seat.branch,
                    quota: 'AI',
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

        const newPrediction = await Prediction.create({
            input: { percentile, category, homeState, gender, exam },
            results: results
        });

        res.status(200).json({
            success: true,
            predictionId: newPrediction._id,
            input: newPrediction.input,
            estimated_rank: expectedRank,
            summary,
            results,
            iit_eligibility: {
                eligible_for_jee_advanced: percentile > 90,
                note: percentile > 90 ? "You are likely eligible." : "You might miss the cutoff."
            }
        });

    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Predict Medical Colleges based on NEET Score
 */
export const neetPredict = async (req: Request, res: Response): Promise<void> => {
    try {
        const { score, category, homeState, gender } = req.body;

        if (!score || !category || !homeState || !gender) {
            res.status(400).json({ success: false, message: 'Please provide all details' });
            return;
        }

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
 * @desc    Predict BITSAT colleges based on Score
 * @route   POST /api/predictor/bitsat-predict
 * @access  Public
 */
export const bitsatPredict = async (req: Request, res: Response): Promise<void> => {
    try {
        const { score } = req.body;
        const userScore = Number(score);

        const colleges = await College.find({
            'cutoffs.exam': 'BITSAT'
        }).select('name location type cutoffs coursesOffered slug');

        const results: Record<string, Record<string, any[]>> = {
            BITS_Pilani: { good_chances: [], may_get: [], tough_chances: [] },
            BITS_Goa: { good_chances: [], may_get: [], tough_chances: [] },
            BITS_Hyderabad: { good_chances: [], may_get: [], tough_chances: [] }
        };

        const summary: Record<string, number> = { good_chances: 0, may_get: 0, tough_chances: 0 };

        for (const college of colleges) {
            const relevantCutoffs = college.cutoffs.filter(c => c.exam === 'BITSAT');

            for (const seat of relevantCutoffs) {
                const closingRank = seat.closingRank;
                let chanceType = '';

                if (userScore >= closingRank) chanceType = 'good_chances';
                else if (userScore >= closingRank - 10) chanceType = 'may_get';
                else chanceType = 'tough_chances';

                let bitsType = '';
                if (college.name.includes('Pilani')) bitsType = 'BITS_Pilani';
                else if (college.name.includes('Goa')) bitsType = 'BITS_Goa';
                else if (college.name.includes('Hyderabad')) bitsType = 'BITS_Hyderabad';

                const entry = {
                    college_name: college.name,
                    college_slug: college.slug,
                    course: seat.branch,
                    cutoff_score: closingRank,
                    chance: chanceType
                };

                if (results[bitsType]) {
                    results[bitsType][chanceType].push(entry);
                    summary[chanceType]++;
                }
            }
        }

        const newPrediction = await Prediction.create({
            input: { score: userScore, exam: 'BITSAT' },
            results: results
        });

        res.status(200).json({
            success: true,
            predictionId: newPrediction._id,
            input: newPrediction.input,
            summary,
            results
        });

    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Predict VITEEE colleges based on Rank
 * @route   POST /api/predictor/viteee-predict
 * @access  Public
 */
export const viteeePredict = async (req: Request, res: Response): Promise<void> => {
    try {
        const { rank, category = 'Category 1' } = req.body;
        const userRank = Number(rank);

        const colleges = await College.find({
            $or: [
                { 'cutoffs.exam': 'VITEEE' },
                { 'cutoffs.exam': 'VIT_NON_VITEEE' }
            ]
        }).select('name location type cutoffs coursesOffered slug');

        const results: Record<string, Record<string, any[]>> = {
            'VIT_Vellore': { high: [], medium: [], low: [] },
            'VIT_Chennai': { high: [], medium: [], low: [] },
            'VIT_AP': { high: [], medium: [], low: [] },
            'VIT_Bhopal': { high: [], medium: [], low: [] }
        };

        const summary: Record<string, number> = { high: 0, medium: 0, low: 0 };

        for (const college of colleges) {
            // --- VITEEE (rank-based) ---
            const viteeeCutoffs = college.cutoffs.filter(c => c.exam === 'VITEEE' && c.category === category);
            for (const seat of viteeeCutoffs) {
                const closingRank = seat.closingRank;
                let chance: 'high' | 'medium' | 'low' = 'low';
                if (userRank <= closingRank * 0.9) chance = 'high';
                else if (userRank <= closingRank * 1.1) chance = 'medium';

                let vitType = '';
                if (college.name.includes('Vellore')) vitType = 'VIT_Vellore';
                else if (college.name.includes('Chennai')) vitType = 'VIT_Chennai';
                else if (college.name.includes('AP')) vitType = 'VIT_AP';
                else if (college.name.includes('Bhopal')) vitType = 'VIT_Bhopal';

                if (results[vitType]) {
                    results[vitType][chance].push({
                        college_name: college.name,
                        college_slug: college.slug,
                        course: seat.branch,
                        closing_rank: closingRank,
                        category: category,
                        chance
                    });
                    summary[chance]++;
                }
            }

            // --- Non-VITEEE programs (always included regardless of rank) ---
            const nonViteeeCutoffs = college.cutoffs.filter(c => c.exam === 'VIT_NON_VITEEE');
            for (const seat of nonViteeeCutoffs) {
                let vitType = '';
                if (college.name.includes('Vellore')) vitType = 'VIT_Vellore';
                else if (college.name.includes('Chennai')) vitType = 'VIT_Chennai';
                else if (college.name.includes('AP')) vitType = 'VIT_AP';
                else if (college.name.includes('Bhopal')) vitType = 'VIT_Bhopal';

                if (results[vitType]) {
                    // Non-VITEEE programs are shown as 'medium' (separate admission process)
                    results[vitType]['medium'].push({
                        college_name: college.name,
                        college_slug: college.slug,
                        course: seat.branch,
                        closing_rank: seat.closingRank,
                        category: seat.category, // e.g. 'GATE', 'CAT/MAT', 'Direct'
                        chance: 'medium'
                    });
                    summary['medium']++;
                }
            }
        }

        const newPrediction = await Prediction.create({
            input: { rank: userRank, category, exam: 'VITEEE' },
            results: results
        });

        res.status(200).json({
            success: true,
            predictionId: newPrediction._id,
            input: newPrediction.input,
            summary,
            results
        });

    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Get prediction by ID
 */
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

/**
 * @desc    Predict Rank based on Score and Exam
 */
export const predictRank = async (req: Request, res: Response): Promise<void> => {
    try {
        const { score, exam } = req.body;
        if (!score || !exam) {
            res.status(400).json({ success: false, message: 'Please provide score and exam' });
            return;
        }
        const scoreNum = Number(score);
        const trends = await RankTrend.find({ exam }).sort({ score: -1 });

        if (trends.length === 0) {
            const mockRank = Math.floor(1000000 / (scoreNum + 1));
            res.status(200).json({
                success: true,
                rank: mockRank,
                is_mock: true,
                message: 'Using estimated mock logic as no trend data found'
            });
            return;
        }

        let predictedRank = 0;
        let upper = trends.find(t => t.score >= scoreNum);
        let lower = [...trends].reverse().find(t => t.score <= scoreNum);

        if (upper && lower && upper._id !== lower._id) {
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
