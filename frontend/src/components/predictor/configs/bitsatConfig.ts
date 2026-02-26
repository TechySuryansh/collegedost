import type { PredictorConfig, FlatCollege, NormalizedPrediction, AdmissionChance } from '../types';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir',
  'Ladakh', 'Chandigarh', 'Puducherry', 'Andaman and Nicobar Islands',
  'Dadra and Nagar Haveli and Daman and Diu', 'Lakshadweep',
];

let _lastUserScore = 0;

export const bitsatConfig: PredictorConfig = {
  examName: 'BITSAT',
  examSlug: 'bitsat',
  year: 2026,
  pageTitle: 'BITSAT College Predictor',
  pageSubtitle: 'Comprehensive Merit-Based Predictor for BITS Pilani, Goa and Hyderabad Campuses',

  inputConfig: {
    label: 'BITSAT Score',
    placeholder: 'Enter BITSAT Score (0-390)',
    type: 'score',
    min: 0,
    max: 390,
    validationMessage: 'Please enter a valid BITSAT Score (0-390)',
  },

  categories: ['General', 'OBC-NCL', 'SC', 'ST', 'EWS'],
  states: INDIAN_STATES,
  genders: ['Male', 'Female'],
  programTypes: ['B.E.', 'B.Pharm', 'Integrated M.Sc.'],

  steps: [
    { number: 1, label: 'Score & Gender' },
    { number: 2, label: 'Category & State' },
    { number: 3, label: 'Get Prediction' }
  ],

  sidebarFilters: {
    quotaTypes: [
      { label: 'General / Merit', value: 'All India', defaultChecked: true },
      { label: 'Category Quota', value: 'Category', defaultChecked: false }
    ],
    institutionTypes: [
      { label: 'BITS Pilani', value: 'BITS Pilani', defaultChecked: true },
      { label: 'BITS Goa', value: 'BITS Goa', defaultChecked: true },
      { label: 'BITS Hyderabad', value: 'BITS Hyderabad', defaultChecked: true },
    ],
    branchInterests: [
      // B.E. Branches
      { label: 'Computer Science', value: 'Computer Science', defaultChecked: true },
      { label: 'Electronics & Communication', value: 'Electronics & Communication', defaultChecked: true },
      { label: 'Electrical & Electronics', value: 'Electrical & Electronics', defaultChecked: true },
      { label: 'Electronics & Instrumentation', value: 'Electronics & Instrumentation', defaultChecked: false },
      { label: 'Mechanical', value: 'Mechanical', defaultChecked: false },
      { label: 'Civil', value: 'Civil', defaultChecked: false },
      { label: 'Chemical', value: 'Chemical', defaultChecked: false },
      { label: 'Manufacturing Engineering', value: 'Manufacturing', defaultChecked: false },
      // B.Pharm
      { label: 'Pharmacy', value: 'Pharmacy', defaultChecked: false },
      // Integrated M.Sc.
      { label: 'Biological Sciences', value: 'Biological', defaultChecked: false },
      { label: 'Chemistry', value: 'Chemistry', defaultChecked: false },
      { label: 'Economics', value: 'Economics', defaultChecked: false },
      { label: 'Mathematics', value: 'Mathematics', defaultChecked: false },
      { label: 'Physics', value: 'Physics', defaultChecked: false },
    ],
    programTypes: [
      { label: 'B.E. (Engineering)', value: 'B.E.', defaultChecked: true },
      { label: 'B.Pharm', value: 'B.Pharm', defaultChecked: true },
      { label: 'Integrated M.Sc.', value: 'Integrated M.Sc.', defaultChecked: true },
    ],
  },

  apiConfig: {
    predictEndpoint: '/colleges/predict',
    predictMethod: 'GET',
    buildRequestPayload: (input) => {
      _lastUserScore = input.value;
      return {
        rank: input.value,
        exam: 'BITSAT',
        category: input.category,
        state: input.homeState,
        gender: input.gender,
      };
    },

    parseResponse: (response: any): NormalizedPrediction => {
      const colleges: FlatCollege[] = (response.data || []).map((item: any) => {
        const matchingCutoff = item.matchingCutoffs?.[0];
        const cutoff = matchingCutoff?.closingRank || 0;
        const score = _lastUserScore;
        const diff = score - cutoff;

        let chance: AdmissionChance = 'not-eligible';

        if (diff >= 0) {
          chance = 'high';
        } else if (diff >= -10) {
          chance = 'medium';
        } else if (diff >= -20) {
          chance = 'low';
        } else {
          chance = 'not-eligible';
        }

        const courseName = matchingCutoff?.branch || '';
        let programType = 'B.E.';
        if (courseName.toLowerCase().includes('pharm')) programType = 'B.Pharm';
        else if (courseName.toLowerCase().includes('m.sc') || courseName.toLowerCase().includes('integrated')) programType = 'Integrated M.Sc.';

        return {
          id: `${item._id}-${courseName}`,
          collegeName: item.name,
          institutionAbbrev: 'BITS',
          location: `${item.location?.city}, ${item.location?.state}`,
          course: courseName || 'Degree Program',
          quota: matchingCutoff?.quota || 'General Merit',
          closingRank: cutoff,
          chance: chance,
          institutionType: 'Deemed University',
          programType: programType
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
        }
      };
    },
  },

  sortOptions: [
    { label: 'Admission Chance', value: 'chance' },
    { label: 'Closing Score (High to Low)', value: 'closingRank' },
    { label: 'NIRF Rank', value: 'nirfRank' }
  ],

  urlPath: '/predictors/bitsat-predictor',
};
