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
  states: [], // GATE does not use Home State quota
  genders: [],
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
  ],

  sidebarFilters: {
    quotaTypes: [
      { label: 'General / Open', value: 'Open', defaultChecked: true },
      { label: 'OBC/SC/ST Quota', value: 'Category', defaultChecked: true },
    ],
    institutionTypes: [
      { label: 'IITs / IISc', value: 'IIT', defaultChecked: true },
      { label: 'NITs', value: 'NIT', defaultChecked: true },
      { label: 'IIITs', value: 'IIIT', defaultChecked: true },
      { label: 'GFTIs / Research Govt.', value: 'GFTI', defaultChecked: true },
    ],
    branchInterests: [
      { label: 'CS – Computer Science', value: 'CS', defaultChecked: true },
      { label: 'EC – Electronics & Comm.', value: 'EC', defaultChecked: true },
      { label: 'EE – Electrical Eng.', value: 'EE', defaultChecked: true },
      { label: 'ME – Mechanical Eng.', value: 'ME', defaultChecked: true },
      { label: 'CE – Civil Engineering', value: 'CE', defaultChecked: true },
      { label: 'DA – Data Science & AI', value: 'DA', defaultChecked: true },
      { label: 'CH – Chemical Eng.', value: 'CH', defaultChecked: true },
      { label: 'IN – Instrumentation', value: 'IN', defaultChecked: true },
      { label: 'BT – Biotechnology', value: 'BT', defaultChecked: true },
      { label: 'AE – Aerospace Eng.', value: 'AE', defaultChecked: true },
      { label: 'MA – Mathematics', value: 'MA', defaultChecked: true },
      { label: 'PH – Physics', value: 'PH', defaultChecked: true },
    ],
    programTypes: [
      { label: 'M.Tech / M.E.', value: 'Engineering', defaultChecked: true },
      { label: 'MS / Research', value: 'Research', defaultChecked: true },
    ],
  },

  apiConfig: {
    predictEndpoint: '/colleges/predict',
    predictMethod: 'GET',
    buildRequestPayload: (input) => {
      _lastUserScore = input.value;
      return {
        rank: input.value,
        exam: 'GATE',
        category: input.category,
        programType: input.programType,
      };
    },

    parseResponse: (response: any): NormalizedPrediction => {
      const colleges: FlatCollege[] = [];
      const score = _lastUserScore;

      for (const item of response.data || []) {
        const instName = item.name || '';
        const locationStr = `${item.location?.city || ''}, ${item.location?.state || ''}`;
        const slug = instName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        // Derive abbreviation and institution type
        let abbrev = 'GATE';
        let derivedInstType = 'GFTI';

        if (instName.includes('Indian Institute of Technology') || instName.includes('IIT')) {
          abbrev = 'IIT'; derivedInstType = 'IIT';
        } else if (instName.includes('Indian Institute of Science') || instName.includes('IISc')) {
          abbrev = 'IISc'; derivedInstType = 'IIT';
        } else if (instName.includes('National Institute of Technology') || instName.includes('NIT')) {
          abbrev = 'NIT'; derivedInstType = 'NIT';
        } else if (instName.includes('Indian Institute of Information Technology') || instName.includes('IIIT')) {
          abbrev = 'IIIT'; derivedInstType = 'IIIT';
        }

        for (const cut of item.matchingCutoffs || []) {
          const cutoff = cut.closing || cut.closingRank || 0;

          let chance: AdmissionChance = 'not-eligible';
          if (score >= cutoff) chance = 'high';
          else if (score >= cutoff - 40) chance = 'medium';
          else if (score >= cutoff - 80) chance = 'low';

          colleges.push({
            id: `${item._id}-${cut.branch}-${cut.quota}-${cutoff}`,
            collegeName: instName,
            collegeSlug: slug,
            institutionAbbrev: abbrev,
            location: locationStr,
            course: cut.branch || 'Engineering Program',
            quota: cut.quota || 'Open',
            closingRank: cutoff,
            cutoffLabel: 'GATE Score',
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
