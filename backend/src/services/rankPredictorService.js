/**
 * JEE Main Rank Predictor Service
 * Predicts expected JEE Main Rank based on percentile
 */

// JEE Main 2024 had approximately 12 lakh candidates
const TOTAL_CANDIDATES = 1200000;

/**
 * Convert percentile to expected rank
 * Formula: Rank = (100 - Percentile) × Total Candidates / 100
 */
const percentileToRank = (percentile) => {
    if (percentile >= 100) return 1;
    if (percentile <= 0) return TOTAL_CANDIDATES;
    
    const rank = Math.round((100 - percentile) * TOTAL_CANDIDATES / 100);
    return Math.max(1, rank);
};

/**
 * Convert expected marks to percentile (approximate)
 * Based on JEE Main 2024 patterns
 */
const marksToPercentile = (marks) => {
    // Max marks: 300
    if (marks >= 280) return 99.99;
    if (marks >= 270) return 99.95;
    if (marks >= 260) return 99.9;
    if (marks >= 250) return 99.8;
    if (marks >= 240) return 99.6;
    if (marks >= 230) return 99.4;
    if (marks >= 220) return 99.0;
    if (marks >= 210) return 98.5;
    if (marks >= 200) return 98.0;
    if (marks >= 190) return 97.0;
    if (marks >= 180) return 96.0;
    if (marks >= 170) return 95.0;
    if (marks >= 160) return 93.0;
    if (marks >= 150) return 91.0;
    if (marks >= 140) return 88.0;
    if (marks >= 130) return 85.0;
    if (marks >= 120) return 82.0;
    if (marks >= 110) return 78.0;
    if (marks >= 100) return 74.0;
    if (marks >= 90) return 70.0;
    if (marks >= 80) return 65.0;
    if (marks >= 70) return 60.0;
    if (marks >= 60) return 52.0;
    if (marks >= 50) return 45.0;
    if (marks >= 40) return 35.0;
    return marks * 0.8; // Below 40 marks
};

/**
 * Get rank range (confidence interval)
 */
const getRankRange = (rank) => {
    const variance = Math.max(100, Math.round(rank * 0.1)); // 10% variance
    return {
        min: Math.max(1, rank - variance),
        max: Math.min(TOTAL_CANDIDATES, rank + variance)
    };
};

/**
 * Determine eligibility based on rank
 */
const getEligibility = (rank, category) => {
    const eligibility = {
        iitEligible: false,
        nitEligible: false,
        iiitEligible: false,
        gftiEligible: false,
        jeeAdvancedEligible: false
    };

    // Category-wise cutoffs (approximate)
    const catMultiplier = {
        'General': 1,
        'EWS': 1.2,
        'OBC-NCL': 1.5,
        'OBC': 1.5,
        'SC': 2.5,
        'ST': 4.0
    }[category] || 1;

    // JEE Advanced eligibility (Top 2.5 lakh)
    eligibility.jeeAdvancedEligible = rank <= 250000 * catMultiplier;

    // NIT eligibility
    eligibility.nitEligible = rank <= 100000 * catMultiplier;

    // IIIT eligibility
    eligibility.iiitEligible = rank <= 80000 * catMultiplier;

    // GFTI eligibility
    eligibility.gftiEligible = rank <= 200000 * catMultiplier;

    // IIT eligibility (depends on JEE Advanced)
    eligibility.iitEligible = eligibility.jeeAdvancedEligible;

    return eligibility;
};

/**
 * Get college possibilities based on rank
 */
const getCollegePossibilities = (rank, category) => {
    const catMultiplier = {
        'General': 1,
        'EWS': 1.2,
        'OBC-NCL': 1.5,
        'OBC': 1.5,
        'SC': 2.5,
        'ST': 4.0
    }[category] || 1;

    const possibilities = [];

    // Top NITs
    if (rank <= 5000 * catMultiplier) {
        possibilities.push({ 
            type: 'Top NITs', 
            chance: 'High',
            examples: ['NIT Trichy', 'NIT Warangal', 'NIT Surathkal', 'NIT Rourkela'],
            branches: ['CSE', 'ECE', 'EE']
        });
    } else if (rank <= 15000 * catMultiplier) {
        possibilities.push({ 
            type: 'Top NITs', 
            chance: 'Medium',
            examples: ['NIT Trichy', 'NIT Warangal', 'NIT Surathkal'],
            branches: ['Mechanical', 'Civil', 'Chemical']
        });
    }

    // Mid-tier NITs
    if (rank <= 25000 * catMultiplier) {
        possibilities.push({ 
            type: 'NITs (Tier 2)', 
            chance: 'High',
            examples: ['NIT Jaipur', 'VNIT Nagpur', 'MNNIT Allahabad', 'NIT Durgapur'],
            branches: ['CSE', 'ECE', 'EE']
        });
    } else if (rank <= 50000 * catMultiplier) {
        possibilities.push({ 
            type: 'NITs (Tier 2)', 
            chance: 'Medium',
            examples: ['NIT Jaipur', 'VNIT Nagpur', 'MNNIT Allahabad'],
            branches: ['Various Core Branches']
        });
    }

    // IIITs
    if (rank <= 10000 * catMultiplier) {
        possibilities.push({ 
            type: 'Top IIITs', 
            chance: 'High',
            examples: ['IIIT Hyderabad', 'IIIT Delhi', 'IIIT Bangalore'],
            branches: ['CSE', 'IT', 'ECE']
        });
    } else if (rank <= 30000 * catMultiplier) {
        possibilities.push({ 
            type: 'IIITs', 
            chance: 'Medium',
            examples: ['IIIT Allahabad', 'IIIT Gwalior', 'IIIT Jabalpur'],
            branches: ['CSE', 'IT']
        });
    }

    // GFTIs
    if (rank <= 50000 * catMultiplier) {
        possibilities.push({ 
            type: 'GFTIs', 
            chance: 'High',
            examples: ['IIEST Shibpur', 'IIITDM Jabalpur', 'NIT Goa'],
            branches: ['CSE', 'ECE']
        });
    } else if (rank <= 100000 * catMultiplier) {
        possibilities.push({ 
            type: 'GFTIs', 
            chance: 'Medium',
            examples: ['Various GFTIs'],
            branches: ['Various branches']
        });
    }

    // Private Colleges
    if (rank <= 100000) {
        possibilities.push({ 
            type: 'Top Private', 
            chance: 'High',
            examples: ['BITS Pilani', 'VIT Vellore', 'Thapar University', 'Manipal'],
            branches: ['CSE', 'ECE']
        });
    }

    return possibilities;
};

/**
 * Main rank prediction function
 * @param {number} percentile - JEE Main percentile
 * @param {string} category - General, OBC, SC, ST, EWS
 * @param {number|null} marks - Optional marks (out of 300)
 * @returns {Object} Prediction results
 */
const predictRank = (percentile, category, marks = null) => {
    // If marks provided, convert to percentile
    let pct = percentile;
    let estimatedFromMarks = false;
    
    if (marks !== null && marks > 0) {
        pct = marksToPercentile(marks);
        estimatedFromMarks = true;
    }

    const expectedRank = percentileToRank(pct);
    const rankRange = getRankRange(expectedRank);
    const eligibility = getEligibility(expectedRank, category);
    const possibilities = getCollegePossibilities(expectedRank, category);

    return {
        input: {
            percentile: pct,
            marks: marks,
            category,
            estimatedFromMarks
        },
        prediction: {
            expected_rank: expectedRank,
            rank_range: rankRange,
            confidence: '85%'
        },
        eligibility,
        college_possibilities: possibilities,
        tips: getTips(expectedRank, eligibility)
    };
};

/**
 * Get personalized tips based on rank
 */
const getTips = (rank, eligibility) => {
    const tips = [];

    if (eligibility.jeeAdvancedEligible) {
        tips.push({
            icon: '🎯',
            title: 'JEE Advanced Eligible',
            text: 'You qualify for JEE Advanced. Start preparing now for IITs!'
        });
    }

    if (rank <= 50000) {
        tips.push({
            icon: '💡',
            title: 'JoSAA Counseling',
            text: 'Register for JoSAA counseling early. Keep all documents ready.'
        });
    }

    if (rank > 50000 && rank <= 150000) {
        tips.push({
            icon: '📝',
            title: 'State Counselings',
            text: 'Also register for state counseling like UPTAC, JOSAA, GGSIPU, etc.'
        });
    }

    tips.push({
        icon: '📊',
        title: 'Choice Filling',
        text: 'Fill maximum choices in counseling. Priority matters!'
    });

    return tips;
};

module.exports = { predictRank, percentileToRank, marksToPercentile, getRankRange };
