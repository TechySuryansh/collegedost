import type { PredictorConfig, FlatCollege, NormalizedPrediction, AdmissionChance } from '../types';

let _lastUserPercentile = 0;

export const catConfig: PredictorConfig = {
  examName: 'CAT',
  examSlug: 'cat',
  year: 2026,
  pageTitle: 'CAT MBA College Predictor',
  pageSubtitle: 'Detailed Predictor for IIMs, IITs, and Top Private B-Schools',

  inputConfig: {
    label: 'CAT Percentile',
    placeholder: 'Enter Percentile (e.g. 98.5)',
    type: 'percentile',
    min: 0,
    max: 100,
    validationMessage: 'Please enter a valid percentile (0-100)',
  },

  categories: ['General', 'OBC', 'SC', 'ST', 'EWS', 'PwD'],
  states: [],
  genders: [],
  programTypes: [
    'MBA',
    'PGDM',
    'Executive MBA',
    'Integrated MBA',
    'Business Analytics',
    'MBA Specializations',
    'PhD (Management)'
  ],
  rankBasedPrograms: [
    'MBA',
    'PGDM',
    'Executive MBA',
    'Integrated MBA',
    'Business Analytics',
    'MBA Specializations'
  ],

  steps: [
    { number: 1, label: 'Score & Program' },
    { number: 2, label: 'Category' },
    { number: 3, label: 'B-School List' }
  ],

  sidebarFilters: {
    quotaTypes: [
      { label: 'General / Non-IIM', value: 'General', defaultChecked: true },
      { label: 'Category Quota', value: 'Category', defaultChecked: false }
    ],
    institutionTypes: [
      { label: 'IIMs (Old & New)', value: 'IIM', defaultChecked: true },
      { label: 'IITs / NITs (MBA)', value: 'IIT-NIT', defaultChecked: true },
      { label: 'Tier 1 Private (MDI/FMS/SPJIMR)', value: 'Tier 1 Private', defaultChecked: true },
      { label: 'Tier 2 Private (IMT/IMI)', value: 'Tier 2 Private', defaultChecked: false },
    ],
    branchInterests: [
      { label: 'General Management', value: 'General Management', defaultChecked: true },
      { label: 'Finance', value: 'Finance', defaultChecked: true },
      { label: 'Marketing', value: 'Marketing', defaultChecked: true },
      { label: 'Business Analytics', value: 'Business Analytics', defaultChecked: false },
      { label: 'Human Resource Management', value: 'Human Resource', defaultChecked: false },
      { label: 'Operations Management', value: 'Operations', defaultChecked: false },
      { label: 'IT & Systems', value: 'IT & Systems', defaultChecked: false },
      { label: 'Supply Chain', value: 'Supply Chain', defaultChecked: false },
      { label: 'Entrepreneurship', value: 'Entrepreneurship', defaultChecked: false },
      { label: 'International Business', value: 'International Business', defaultChecked: false },
    ],
    programTypes: [
      { label: 'MBA / PGDM', value: 'Main', defaultChecked: true },
      { label: 'Executive / PhD', value: 'Adv', defaultChecked: false },
    ],
  },

  apiConfig: {
    predictEndpoint: '/colleges/predict',
    predictMethod: 'GET',
    buildRequestPayload: (input) => {
      _lastUserPercentile = input.value;
      const isRankMode = catConfig.rankBasedPrograms?.includes(input.programType);
      return {
        percentile: isRankMode ? input.value : 0,
        exam: 'CAT',
        category: input.category,
        programType: input.programType,
      };
    },

    parseResponse: (response: any): NormalizedPrediction => {
      const colleges: FlatCollege[] = (response.data || []).map((item: any) => {
        const matchingCutoff = item.matchingCutoffs?.[0];
        const cutoff = matchingCutoff?.closingRank || 0; // Backend uses closingRank for thresholds
        const score = _lastUserPercentile;

        let chance: AdmissionChance = 'not-eligible';

        // MBA Percentile Logic (Higher cutoff = harder)
        if (score >= cutoff) {
          chance = 'high';
        } else if (score >= cutoff - 2) {
          chance = 'medium';
        } else if (score >= cutoff - 5) {
          chance = 'low';
        } else {
          chance = 'not-eligible';
        }

        return {
          id: `${item._id}-${matchingCutoff?.branch || 'MBA'}`,
          collegeName: item.name,
          institutionAbbrev: item.name.includes('IIM') ? 'IIM' : 'MBA',
          location: `${item.location?.city}, ${item.location?.state}`,
          course: matchingCutoff?.branch || 'Management Program',
          quota: matchingCutoff?.category || 'General',
          closingRank: cutoff,
          chance: chance,
          institutionType: 'Management Institute',
          programType: matchingCutoff?.programType || 'MBA'
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
    { label: 'Cutoff Percentile (High to Low)', value: 'closingRank' },
  ],

  urlPath: '/predictors/cat-predictor',
};
