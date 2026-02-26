import type { PredictorConfig, FlatCollege, NormalizedPrediction, AdmissionChance } from '../types';

let _lastUserPercentile = 0;

// All 28 Indian States + major Union Territories
const INDIAN_STATES = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
    // Union Territories
    'Delhi',
    'Jammu & Kashmir',
    'Ladakh',
    'Chandigarh',
    'Puducherry',
    'Andaman & Nicobar Islands',
    'Dadra & Nagar Haveli and Daman & Diu',
    'Lakshadweep',
];

export const mhtcetConfig: PredictorConfig = {
    examName: 'MHT CET',
    examSlug: 'mht-cet',
    year: 2026,
    pageTitle: 'MHT CET College Predictor',
    pageSubtitle: 'Predict Engineering & Pharmacy Colleges in Maharashtra via CAP Rounds',

    inputConfig: {
        label: 'MHT CET Percentile',
        placeholder: 'Enter Percentile (e.g. 97.50)',
        type: 'percentile',
        min: 0,
        max: 100,
        validationMessage: 'Please enter a valid MHT CET percentile (0–100)',
    },

    // Maharashtra-specific Category list (CAP cell officially uses these)
    categories: [
        'General',
        'OBC',
        'SC',
        'ST',
        'VJNT',
        'SBC',
        'EWS',
        'PwD',
        'TFWS',
    ],

    // MHT-CET uses Home University region, not state (handled via sidebarFilters quotaTypes)
    states: INDIAN_STATES,

    genders: ['Male', 'Female'],

    programTypes: [
        // MHT-CET Based Programs (rank/percentile input shown)
        'B.E. / B.Tech',
        'B.Pharm',
        'Pharm D',
        // Non-MHT-CET Programs (input hidden)
        'Diploma Engineering',
        'B.Sc',
        'BCA',
        'BBA',
        'M.Tech',
        'M.Pharm',
        'MBA / MMS',
        'MCA',
    ],

    // Only these 3 need MHT-CET percentile shown
    rankBasedPrograms: ['B.E. / B.Tech', 'B.Pharm', 'Pharm D'],

    steps: [
        { number: 1, label: 'Program & Percentile' },
        { number: 2, label: 'Category & Region' },
        { number: 3, label: 'College Matching' },
    ],

    sidebarFilters: {
        quotaTypes: [
            { label: 'Home University (HU)', value: 'HU', defaultChecked: true },
            { label: 'Other than Home University (OHU)', value: 'OHU', defaultChecked: false },
            { label: 'TFWS (Tuition Fee Waiver)', value: 'TFWS', defaultChecked: false },
            { label: 'Minority (Religious / Linguistic)', value: 'Minority', defaultChecked: false },
        ],
        institutionTypes: [
            { label: 'Government Engineering Colleges', value: 'Government', defaultChecked: true },
            { label: 'Government-Aided Colleges', value: 'Government Aided', defaultChecked: true },
            { label: 'Autonomous Colleges', value: 'Autonomous', defaultChecked: true },
            { label: 'University Departments', value: 'University', defaultChecked: false },
            { label: 'Un-aided Private Colleges', value: 'Private Unaided', defaultChecked: false },
            { label: 'Pharmacy Colleges (Govt + Pvt)', value: 'Pharmacy', defaultChecked: false },
            { label: "Women's Colleges", value: 'Women', defaultChecked: false },
        ],
        branchInterests: [
            // --- Engineering Branches ---
            { label: 'Computer Engineering', value: 'Computer Engineering', defaultChecked: true },
            { label: 'Information Technology', value: 'IT', defaultChecked: true },
            { label: 'AI & Machine Learning', value: 'AI-ML', defaultChecked: false },
            { label: 'AI & Data Science', value: 'AI-DS', defaultChecked: false },
            { label: 'Electronics & Telecomm (ENTC)', value: 'ENTC', defaultChecked: false },
            { label: 'Electrical Engineering', value: 'Electrical', defaultChecked: false },
            { label: 'Mechanical Engineering', value: 'Mechanical', defaultChecked: false },
            { label: 'Civil Engineering', value: 'Civil', defaultChecked: false },
            { label: 'Chemical Engineering', value: 'Chemical', defaultChecked: false },
            { label: 'Biotechnology', value: 'Biotechnology', defaultChecked: false },
            { label: 'Robotics & Automation', value: 'Robotics', defaultChecked: false },
            { label: 'Aeronautical Engineering', value: 'Aeronautical', defaultChecked: false },
            { label: 'Automobile Engineering', value: 'Automobile', defaultChecked: false },
            { label: 'Instrumentation Engineering', value: 'Instrumentation', defaultChecked: false },
            { label: 'Biomedical Engineering', value: 'Biomedical', defaultChecked: false },
            { label: 'Food Technology', value: 'Food Technology', defaultChecked: false },
            { label: 'Textile Engineering', value: 'Textile', defaultChecked: false },
            { label: 'Agricultural Engineering', value: 'Agricultural', defaultChecked: false },
            { label: 'Metallurgy & Materials', value: 'Metallurgy', defaultChecked: false },
            // --- Pharmacy Branches ---
            { label: 'Pharmacy (B.Pharm)', value: 'Pharmacy', defaultChecked: false },
            { label: 'Clinical Pharmacy', value: 'Clinical Pharmacy', defaultChecked: false },
            { label: 'Pharmaceutical Chemistry', value: 'Pharma Chemistry', defaultChecked: false },
            { label: 'Pharmaceutical Technology', value: 'Pharma Technology', defaultChecked: false },
        ],
        programTypes: [
            { label: 'Engineering (B.E./B.Tech)', value: 'Engineering', defaultChecked: true },
            { label: 'Pharmacy (B.Pharm/Pharm D)', value: 'Pharmacy', defaultChecked: false },
        ],
    },

    apiConfig: {
        predictEndpoint: '/colleges/predict',
        predictMethod: 'GET',
        buildRequestPayload: (input) => {
            _lastUserPercentile = input.value;
            const isRankMode = mhtcetConfig.rankBasedPrograms?.includes(input.programType);
            return {
                percentile: isRankMode ? input.value : 0,
                exam: 'MHT CET',
                category: input.category,
                programType: input.programType,
                homeState: input.homeState, // used as Home University Region for MHT-CET
                gender: input.gender,
            };
        },

        parseResponse: (response: any): NormalizedPrediction => {
            const colleges: FlatCollege[] = (response.data || []).map((item: any) => {
                const matchingCutoff = item.matchingCutoffs?.[0];
                // Backend stores percentile cutoff inside closingRank field for uniformity
                const cutoff = matchingCutoff?.closingRank || 0;
                const score = _lastUserPercentile;

                let chance: AdmissionChance = 'not-eligible';

                // MHT-CET Percentile Logic (higher = better)
                if (score >= cutoff) {
                    chance = 'high';
                } else if (score >= cutoff - 2) {
                    chance = 'medium';
                } else if (score >= cutoff - 5) {
                    chance = 'low';
                } else {
                    chance = 'not-eligible';
                }

                const instName = item.name || '';
                let abbrev = 'MHT';
                if (instName.includes('COEP') || instName.includes('College of Engineering, Pune')) abbrev = 'COEP';
                else if (instName.includes('VJTI')) abbrev = 'VJTI';
                else if (instName.includes('SPIT') || instName.includes('Sardar Patel')) abbrev = 'SPIT';
                else if (instName.includes('PICT')) abbrev = 'PICT';
                else if (instName.includes('PCCOE')) abbrev = 'PCOE';
                else if (instName.toUpperCase().includes('GOVERNMENT')) abbrev = 'GOVT';

                return {
                    id: `${item._id}-${matchingCutoff?.branch || 'MHT-CET'}`,
                    collegeName: instName,
                    institutionAbbrev: abbrev,
                    location: `${item.location?.city || ''}, Maharashtra`,
                    course: matchingCutoff?.branch || 'Engineering',
                    quota: matchingCutoff?.quota || 'OPEN',
                    closingRank: cutoff,
                    chance: chance,
                    institutionType: item.institutionType || 'Maharashtra Institute',
                    programType: matchingCutoff?.programType || 'B.E. / B.Tech',
                };
            });

            return {
                success: response.success,
                totalResults: colleges.length,
                colleges,
                summary: {
                    high: colleges.filter(c => c.chance === 'high').length,
                    medium: colleges.filter(c => c.chance === 'medium').length,
                    low: colleges.filter(c => c.chance === 'low').length,
                    'not-eligible': colleges.filter(c => c.chance === 'not-eligible').length,
                },
            };
        },
    },

    sortOptions: [
        { label: 'Admission Chance', value: 'chance' },
        { label: 'Closing Percentile (High to Low)', value: 'closingRank' },
    ],

    urlPath: '/predictors/mht-cet-predictor',
};
