import type { PredictorConfig, FlatCollege, NormalizedPrediction, AdmissionChance } from '../types';

let _lastUserScore = 0;

export const gateConfig: PredictorConfig = {
  examName: 'GATE',
  examSlug: 'gate',
  year: 2026,
  pageTitle: 'GATE College Predictor',
  pageSubtitle: 'Predict M.Tech / M.E. / MS Admission chances in IITs, NITs, and IIITs',

  inputConfig: {
    label: 'GATE Score',
    placeholder: 'Enter GATE Score (e.g. 750)',
    type: 'score',
    min: 0,
    max: 1000,
    validationMessage: 'Please enter a valid GATE Score (0-1000)',
  },

  categories: ['General', 'OBC', 'SC', 'ST', 'EWS', 'PwD'],
  states: [], // GATE (IITs) does not use Home State quota
  genders: [], // Mostly merit-based, no standard gender quota in GATE
  programTypes: [
    'M.Tech',
    'M.E.',
    'MS by Research',
    'Direct PhD',
    'M.Sc',
    'Sponsored M.Tech'
  ],
  rankBasedPrograms: [
    'M.Tech',
    'M.E.',
    'MS by Research',
    'Direct PhD',
    'M.Sc'
  ],

  steps: [
    { number: 1, label: 'Score & Program' },
    { number: 2, label: 'Paper & Category' },
    { number: 3, label: 'College Matching' }
  ],

  sidebarFilters: {
    quotaTypes: [
      { label: 'General / Open', value: 'Open', defaultChecked: true },
      { label: 'OBC/SC/ST Quota', value: 'Category', defaultChecked: false }
    ],
    institutionTypes: [
      { label: 'IITs / IISc', value: 'IIT', defaultChecked: true },
      { label: 'NITs', value: 'NIT', defaultChecked: true },
      { label: 'IIITs', value: 'IIIT', defaultChecked: true },
      { label: 'GFTIs / Research Govt.', value: 'GFTI', defaultChecked: false },
    ],
    branchInterests: [
      { label: 'CS – Computer Science', value: 'CS', defaultChecked: true },
      { label: 'EC – Electronics & Comm.', value: 'EC', defaultChecked: true },
      { label: 'EE – Electrical Eng.', value: 'EE', defaultChecked: true },
      { label: 'ME – Mechanical Eng.', value: 'ME', defaultChecked: false },
      { label: 'CE – Civil Engineering', value: 'CE', defaultChecked: false },
      { label: 'DA – Data Science & AI', value: 'DA', defaultChecked: false },
      { label: 'CH – Chemical Eng.', value: 'CH', defaultChecked: false },
      { label: 'IN – Instrumentation', value: 'IN', defaultChecked: false },
      { label: 'BT – Biotechnology', value: 'BT', defaultChecked: false },
      { label: 'AE – Aerospace Eng.', value: 'AE', defaultChecked: false },
      { label: 'MA – Mathematics', value: 'MA', defaultChecked: false },
      { label: 'PH – Physics', value: 'PH', defaultChecked: false },
    ],
    programTypes: [
      { label: 'M.Tech / M.E.', value: 'Engineering', defaultChecked: true },
      { label: 'MS / Research', value: 'Research', defaultChecked: false },
    ],
  },

  apiConfig: {
    predictEndpoint: '/colleges/predict',
    predictMethod: 'GET',
    buildRequestPayload: (input) => {
      _lastUserScore = input.value;
      const isRankMode = gateConfig.rankBasedPrograms?.includes(input.programType);
      return {
        score: isRankMode ? input.value : 0,
        exam: 'GATE',
        category: input.category,
        programType: input.programType,
      };
    },

    parseResponse: (response: any): NormalizedPrediction => {
      const colleges: FlatCollege[] = (response.data || []).map((item: any) => {
        const matchingCutoff = item.matchingCutoffs?.[0];
        const cutoff = matchingCutoff?.closingRank || 0; // Using score as cutoff
        const score = _lastUserScore;

        let chance: AdmissionChance = 'not-eligible';

        // GATE Score Logic
        if (score >= cutoff) {
          chance = 'high';
        } else if (score >= cutoff - 40) {
          chance = 'medium';
        } else if (score >= cutoff - 80) {
          chance = 'low';
        } else {
          chance = 'not-eligible';
        }

        return {
          id: `${item._id}-${matchingCutoff?.branch || 'GATE'}`,
          collegeName: item.name,
          institutionAbbrev: item.name.includes('Indian Institute of Technology') ? 'IIT' : 'M.Tech',
          location: `${item.location?.city}, ${item.location?.state}`,
          course: matchingCutoff?.branch || 'Engineering Program',
          quota: matchingCutoff?.category || 'General',
          closingRank: cutoff,
          chance: chance,
          institutionType: 'Postgraduate Engineering Institute',
          programType: matchingCutoff?.programType || 'M.Tech'
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
  ],

  urlPath: '/predictors/gate-predictor',
};
