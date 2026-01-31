/**
 * JEE Main Rank Predictor Controller
 * Handles rank predictions from percentile/marks
 */

const PredictorSettings = require('../models/PredictorSettings.model');
const { predictRank: predictRankService } = require('../services/rankPredictorService');

// AI prediction prompt for rank prediction
const RANK_PROMPT = `You are an expert JEE Main data analyst and counseling expert.

Your task is to predict the expected JEE Main All India Rank (AIR) based on percentile and return a PURE JSON response.

=====================
INPUT DETAILS
=====================
Exam: JEE Main 2026 (use JEE Main 2024-2025 data patterns)
Candidate Percentile: {{percentile}}
Candidate Marks: {{marks}} (if provided, out of 300)
Category: {{category}}

=====================
PREDICTION RULES
=====================
1. JEE Main 2024 had ~12 lakh candidates
2. Rank Formula: Rank ≈ (100 - Percentile) × 12,00,000 / 100
3. Consider category for eligibility cutoffs
4. Provide confidence interval (±10% typically)

=====================
STRICT OUTPUT RULES
=====================
- RETURN ONLY VALID JSON
- NO explanations, NO markdown, NO text outside JSON
- Include rank range for confidence

=====================
JSON STRUCTURE
=====================
{
  "input": {
    "percentile": number,
    "marks": number or null,
    "category": string,
    "estimatedFromMarks": boolean
  },
  "prediction": {
    "expected_rank": number,
    "rank_range": {
      "min": number,
      "max": number
    },
    "confidence": "85%"
  },
  "eligibility": {
    "jeeAdvancedEligible": boolean,
    "nitEligible": boolean,
    "iiitEligible": boolean,
    "gftiEligible": boolean,
    "iitEligible": boolean
  },
  "college_possibilities": [
    {
      "type": "string",
      "chance": "High/Medium/Low",
      "examples": ["college1", "college2"],
      "branches": ["branch1", "branch2"]
    }
  ],
  "tips": [
    {
      "icon": "emoji",
      "title": "string",
      "text": "string"
    }
  ]
}`;

// AI prediction with OpenAI
const predictWithAI = async (percentile, category, marks) => {
    const settings = await PredictorSettings.findOne();
    if (!settings || !settings.hasApiKey()) {
        throw new Error('OpenAI API key not configured');
    }

    const apiKey = settings.getDecryptedApiKey();
    const prompt = RANK_PROMPT
        .replace('{{percentile}}', percentile)
        .replace('{{marks}}', marks || 'Not provided')
        .replace('{{category}}', category);

    const OpenAI = require('openai');
    const openai = new OpenAI({ apiKey });

    const response = await openai.chat.completions.create({
        model: settings.aiModel || 'gpt-4o',
        messages: [
            { role: 'system', content: 'You are a JEE rank prediction expert. Return ONLY valid JSON.' },
            { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 2000,
        response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    const prediction = JSON.parse(content);
    prediction.predictor_status = {
        enabled: true,
        model: settings.aiModel || 'gpt-4o',
        powered_by: 'OpenAI'
    };

    return prediction;
};

// @desc    Predict JEE Main Rank from percentile/marks
// @route   POST /api/predictor/jee-rank-predict
// @access  Public
exports.predictJEERank = async (req, res) => {
    try {
        const { percentile, marks, category } = req.body;

        // Validation
        if (!percentile && !marks) {
            return res.status(400).json({ 
                success: false, 
                message: 'Either percentile or marks is required' 
            });
        }

        const pct = percentile ? parseFloat(percentile) : null;
        const mrks = marks ? parseFloat(marks) : null;
        const cat = category || 'General';

        if (pct !== null && (pct < 0 || pct > 100)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Percentile must be between 0 and 100' 
            });
        }

        if (mrks !== null && (mrks < 0 || mrks > 300)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Marks must be between 0 and 300' 
            });
        }

        // Check if predictor is enabled
        let settings = await PredictorSettings.findOne();
        if (!settings) {
            settings = await PredictorSettings.create({});
        }

        if (!settings.isEnabled) {
            return res.status(503).json({ 
                success: false, 
                message: 'Rank Predictor is currently disabled' 
            });
        }

        let prediction;

        // Use AI if enabled and configured
        if (settings.useAI && settings.hasApiKey()) {
            try {
                prediction = await predictWithAI(pct, cat, mrks);
            } catch (aiError) {
                console.error('AI Prediction failed, falling back to local:', aiError.message);
                prediction = predictRankService(pct, cat, mrks);
                prediction.predictor_status = {
                    enabled: true,
                    model: 'local-algorithm',
                    powered_by: 'CollegeDost',
                    note: 'AI unavailable, using local predictions'
                };
            }
        } else {
            prediction = predictRankService(pct, cat, mrks);
            prediction.predictor_status = {
                enabled: true,
                model: 'local-algorithm',
                powered_by: 'CollegeDost'
            };
        }

        // Save prediction to database
        const RankPrediction = require('../models/RankPrediction.model');
        
        const savedPrediction = await RankPrediction.create({
            user: req.user?._id || null,
            sessionId: req.headers['x-session-id'] || null,
            input: {
                percentile: pct || prediction.input?.percentile,
                marks: mrks,
                category: cat,
                estimatedFromMarks: prediction.input?.estimatedFromMarks || false
            },
            prediction: {
                expectedRank: prediction.prediction?.expected_rank,
                rankRange: prediction.prediction?.rank_range,
                confidence: prediction.prediction?.confidence
            },
            eligibility: prediction.eligibility,
            collegePossibilities: prediction.college_possibilities,
            tips: prediction.tips,
            predictorStatus: {
                enabled: prediction.predictor_status?.enabled,
                model: prediction.predictor_status?.model,
                poweredBy: prediction.predictor_status?.powered_by
            }
        });

        res.status(200).json({
            success: true,
            predictionId: savedPrediction._id,
            ...prediction
        });

    } catch (error) {
        console.error('Rank Prediction Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get rank prediction by ID
// @route   GET /api/predictor/jee-rank-prediction/:id
// @access  Public
exports.getJEERankPredictionById = async (req, res) => {
    try {
        const RankPrediction = require('../models/RankPrediction.model');
        const prediction = await RankPrediction.findById(req.params.id);
        
        if (!prediction) {
            return res.status(404).json({ success: false, message: 'Prediction not found' });
        }

        res.status(200).json({
            success: true,
            predictionId: prediction._id,
            input: prediction.input,
            prediction: {
                expected_rank: prediction.prediction?.expectedRank,
                rank_range: prediction.prediction?.rankRange,
                confidence: prediction.prediction?.confidence
            },
            eligibility: prediction.eligibility,
            college_possibilities: prediction.collegePossibilities,
            tips: prediction.tips,
            predictor_status: {
                enabled: prediction.predictorStatus?.enabled,
                model: prediction.predictorStatus?.model,
                powered_by: prediction.predictorStatus?.poweredBy
            },
            createdAt: prediction.createdAt
        });
    } catch (error) {
        console.error('Get Rank Prediction Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
