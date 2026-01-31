const mongoose = require('mongoose');

const rankPredictionSchema = new mongoose.Schema({
    // User who made the prediction (optional for guests)
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    
    // Session ID for anonymous users
    sessionId: {
        type: String,
        default: null
    },

    // Input parameters
    input: {
        percentile: {
            type: Number
        },
        marks: {
            type: Number,
            default: null
        },
        category: {
            type: String,
            required: true,
            enum: ['General', 'OBC', 'OBC-NCL', 'SC', 'ST', 'EWS']
        },
        estimatedFromMarks: {
            type: Boolean,
            default: false
        }
    },

    // Prediction results
    prediction: {
        expectedRank: {
            type: Number,
            required: true
        },
        rankRange: {
            min: Number,
            max: Number
        },
        confidence: String
    },

    // Eligibility status
    eligibility: {
        jeeAdvancedEligible: Boolean,
        nitEligible: Boolean,
        iiitEligible: Boolean,
        gftiEligible: Boolean,
        iitEligible: Boolean
    },

    // College possibilities
    collegePossibilities: [{
        type: {
            type: String
        },
        chance: String,
        examples: [String],
        branches: [String]
    }],

    // Tips
    tips: [{
        icon: String,
        title: String,
        text: String
    }],

    // Predictor metadata
    predictorStatus: {
        enabled: Boolean,
        model: String,
        poweredBy: String
    },

    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 604800 // Auto-delete after 7 days
    }
}, {
    timestamps: true
});

// Indexes
rankPredictionSchema.index({ user: 1, createdAt: -1 });
rankPredictionSchema.index({ sessionId: 1, createdAt: -1 });
rankPredictionSchema.index({ 'input.percentile': 1, 'input.category': 1 });

module.exports = mongoose.model('RankPrediction', rankPredictionSchema);
