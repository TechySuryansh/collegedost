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
    ],

    sidebarFilters: {
        quotaTypes: [
            { label: 'Home University (HU)', value: 'HU', defaultChecked: true },
            { label: 'Other than Home University (OHU)', value: 'OHU', defaultChecked: true },
            { label: 'TFWS (Tuition Fee Waiver)', value: 'TFWS', defaultChecked: true },
            { label: 'Minority (Religious / Linguistic)', value: 'Minority', defaultChecked: true },
        ],
        institutionTypes: [
            { label: 'Government Engineering Colleges', value: 'Government', defaultChecked: true },
            { label: 'Government-Aided Colleges', value: 'Government Aided', defaultChecked: true },
            { label: 'Autonomous Colleges', value: 'Autonomous', defaultChecked: true },
            { label: 'University Departments', value: 'University', defaultChecked: true },
            { label: 'Un-aided Private Colleges', value: 'Private Unaided', defaultChecked: true },
            { label: 'Pharmacy Colleges (Govt + Pvt)', value: 'Pharmacy', defaultChecked: true },
            { label: "Women's Colleges", value: 'Women', defaultChecked: true },
        ],
        branchInterests: [
            // --- Engineering Branches ---
            { label: 'Computer Engineering', value: 'Computer Engineering', defaultChecked: true },
            { label: 'Information Technology', value: 'IT', defaultChecked: true },
            { label: 'AI & Machine Learning', value: 'AI-ML', defaultChecked: true },
            { label: 'AI & Data Science', value: 'AI-DS', defaultChecked: true },
            { label: 'Electronics & Telecomm (ENTC)', value: 'ENTC', defaultChecked: true },
            { label: 'Electrical Engineering', value: 'Electrical', defaultChecked: true },
            { label: 'Mechanical Engineering', value: 'Mechanical', defaultChecked: true },
            { label: 'Civil Engineering', value: 'Civil', defaultChecked: true },
            { label: 'Chemical Engineering', value: 'Chemical', defaultChecked: true },
            { label: 'Biotechnology', value: 'Biotechnology', defaultChecked: true },
            { label: 'Robotics & Automation', value: 'Robotics', defaultChecked: true },
            { label: 'Aeronautical Engineering', value: 'Aeronautical', defaultChecked: true },
            { label: 'Automobile Engineering', value: 'Automobile', defaultChecked: true },
            { label: 'Instrumentation Engineering', value: 'Instrumentation', defaultChecked: true },
            { label: 'Biomedical Engineering', value: 'Biomedical', defaultChecked: true },
            { label: 'Food Technology', value: 'Food Technology', defaultChecked: true },
            { label: 'Textile Engineering', value: 'Textile', defaultChecked: true },
            { label: 'Agricultural Engineering', value: 'Agricultural', defaultChecked: true },
            { label: 'Metallurgy & Materials', value: 'Metallurgy', defaultChecked: true },
            // --- Pharmacy Branches ---
            { label: 'Pharmacy (B.Pharm)', value: 'Pharmacy', defaultChecked: true },
            { label: 'Clinical Pharmacy', value: 'Clinical Pharmacy', defaultChecked: true },
            { label: 'Pharmaceutical Chemistry', value: 'Pharma Chemistry', defaultChecked: true },
            { label: 'Pharmaceutical Technology', value: 'Pharma Technology', defaultChecked: true },
        ],
        programTypes: [
            { label: 'Engineering (B.E./B.Tech)', value: 'Engineering', defaultChecked: true },
            { label: 'Pharmacy (B.Pharm/Pharm D)', value: 'Pharmacy', defaultChecked: true },
        ],
    },

    apiConfig: {
        predictEndpoint: '/colleges/predict',
        predictMethod: 'GET',
        buildRequestPayload: (input) => {
            _lastUserPercentile = input.value;
            const isRankMode = mhtcetConfig.rankBasedPrograms?.includes(input.programType);
            return {
                rank: isRankMode ? input.value : 0,
                exam: 'MHT CET',
                category: input.category,
                programType: input.programType,
                state: input.homeState,
                gender: input.gender,
            };
        },

        parseResponse: (response: any): NormalizedPrediction => {
            const colleges: FlatCollege[] = [];
            const score = _lastUserPercentile;

            for (const item of response.data || []) {
                const instName = item.name || '';
                const instType = (item.type || '').toLowerCase();
                const instMgmt = (item.management || '').toLowerCase();
                const locationStr = `${item.location?.city || ''}, Maharashtra`;

                let abbrev = 'MHT';
                let derivedInstType = 'Private Unaided';

                if (instName.includes('COEP') || instName.includes('College of Engineering, Pune')) { abbrev = 'COEP'; derivedInstType = 'Government'; }
                else if (instName.includes('VJTI')) { abbrev = 'VJTI'; derivedInstType = 'Government'; }
                else if (instName.includes('SPIT') || instName.includes('Sardar Patel')) { abbrev = 'SPIT'; derivedInstType = 'Government Aided'; }
                else if (instName.includes('PICT')) { abbrev = 'PICT'; derivedInstType = 'Autonomous'; }
                else if (instName.includes('PCCOE')) { abbrev = 'PCOE'; derivedInstType = 'Private Unaided'; }
                else if (instType.includes('government') || instMgmt.includes('government') || instName.toUpperCase().includes('GOVERNMENT')) {
                    abbrev = 'GOVT';
                    derivedInstType = instType.includes('aided') || instMgmt.includes('aided') ? 'Government Aided' : 'Government';
                } else if (instType.includes('university') || instMgmt.includes('university')) {
                    derivedInstType = 'University';
                } else if (instType.includes('autonomous') || instMgmt.includes('autonomous')) {
                    derivedInstType = 'Autonomous';
                } else if (instName.toLowerCase().includes('pharmacy') || instName.toLowerCase().includes('pharma')) {
                    derivedInstType = 'Pharmacy';
                } else if (instName.toLowerCase().includes('women')) {
                    derivedInstType = 'Women';
                }

                for (const cut of item.matchingCutoffs || []) {
                    const cutoff = cut.closing || cut.closingRank || 0;

                    let chance: AdmissionChance = 'not-eligible';
                    if (score >= cutoff) chance = 'high';
                    else if (score >= cutoff - 2) chance = 'medium';
                    else if (score >= cutoff - 5) chance = 'low';

                    colleges.push({
                        id: `${item._id}-${cut.branch}-${cut.quota}-${cutoff}`,
                        collegeName: instName,
                        collegeSlug: instName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                        institutionAbbrev: abbrev,
                        location: locationStr,
                        course: cut.branch || 'Engineering',
                        quota: cut.quota || 'HU',
                        closingRank: cutoff,
                        cutoffLabel: 'Cutoff Percentile',
                        chance,
                        institutionType: derivedInstType,
                    });
                }
            }

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
