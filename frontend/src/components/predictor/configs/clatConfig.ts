import type { PredictorConfig, FlatCollege, NormalizedPrediction, AdmissionChance } from '../types';

let _lastUserRank = 0;

export const clatConfig: PredictorConfig = {
  examName: 'CLAT',
  examSlug: 'clat',
  year: 2026,
  pageTitle: 'CLAT College Predictor',
  pageSubtitle: 'Detailed Predictor for NLUs and Top Private Law Colleges',

  inputConfig: {
    label: 'CLAT All India Rank',
    placeholder: 'Enter Rank (e.g. 1500)',
    type: 'rank',
    min: 1,
    max: 1000000,
    validationMessage: 'Please enter a valid rank',
  },

  categories: ['General', 'OBC', 'SC', 'ST', 'EWS', 'PwD'],
  states: [], // CLAT mostly uses AIQ and Domicile (handled via Quota Type if needed)
  genders: ['Male', 'Female', 'Neutral'],
  programTypes: [
    'BA LLB (Hons.)',
    'BBA LLB',
    'B.Com LLB',
    'B.Sc LLB',
    'LLM (Specializations)',
    'PhD in Law'
  ],
  rankBasedPrograms: [
    'BA LLB (Hons.)',
    'BBA LLB',
    'B.Com LLB',
    'B.Sc LLB',
    'LLM (Specializations)'
  ],

  steps: [
    { number: 1, label: 'Program & Rank' },
    { number: 2, label: 'Category & Gender' },
    { number: 3, label: 'Law School Matching' }
  ],

  sidebarFilters: {
    quotaTypes: [
      { label: 'All India Quota', value: 'AI', defaultChecked: true },
      { label: 'Domicile / State Quota', value: 'Domicile', defaultChecked: false },
      { label: 'NRI / Foreign Quota', value: 'NRI', defaultChecked: false },
    ],
    institutionTypes: [
      { label: 'National Law Universities (NLUs)', value: 'NLU', defaultChecked: true },
      { label: 'Top Private Law Schools (JGLS/ILS)', value: 'Private', defaultChecked: true },
    ],
    branchInterests: [
      // UG Law
      { label: 'Constitutional Law', value: 'Constitutional', defaultChecked: true },
      { label: 'Criminal Law', value: 'Criminal', defaultChecked: true },
      { label: 'Corporate Law', value: 'Corporate', defaultChecked: true },
      { label: 'Human Rights', value: 'Human Rights', defaultChecked: false },
      { label: 'IPR / Cyber Law', value: 'IPR', defaultChecked: false },
      { label: 'Environmental Law', value: 'Environmental', defaultChecked: false },
      { label: 'International Law', value: 'International', defaultChecked: false },
      { label: 'Tax Law', value: 'Tax', defaultChecked: false },
    ],
    programTypes: [
      { label: 'Undergraduate (BA/BBA LLB)', value: 'UG', defaultChecked: true },
      { label: 'Postgraduate (LLM)', value: 'PG', defaultChecked: false },
    ],
  },

  apiConfig: {
    predictEndpoint: '/colleges/predict',
    predictMethod: 'GET',
    buildRequestPayload: (input) => {
      _lastUserRank = input.value;
      const isRankMode = clatConfig.rankBasedPrograms?.includes(input.programType);
      return {
        rank: isRankMode ? input.value : 0,
        exam: 'CLAT',
        category: input.category,
        programType: input.programType,
        gender: input.gender,
      };
    },

    parseResponse: (response: any): NormalizedPrediction => {
      const colleges: FlatCollege[] = (response.data || []).map((item: any) => {
        const matchingCutoff = item.matchingCutoffs?.[0];
        const cutoff = matchingCutoff?.closingRank || 0;
        const rank = _lastUserRank;

        let chance: AdmissionChance = 'not-eligible';

        // CLAT Rank Logic (highly competitive)
        if (rank <= cutoff) {
          chance = 'high';
        } else if (rank <= cutoff * 1.05) {
          chance = 'medium';
        } else if (rank <= cutoff * 1.15) {
          chance = 'low';
        } else {
          chance = 'not-eligible';
        }

        return {
          id: `${item._id}-${matchingCutoff?.branch || 'Law'}`,
          collegeName: item.name,
          institutionAbbrev: item.name.includes('National Law') ? 'NLU' : 'Law',
          location: `${item.location?.city}, ${item.location?.state}`,
          course: matchingCutoff?.branch || 'Law Program',
          quota: matchingCutoff?.category || 'General',
          closingRank: cutoff,
          chance: chance,
          institutionType: 'Law Institute',
          programType: matchingCutoff?.programType || 'Integrated LLB'
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
    { label: 'Closing Rank (Low to High)', value: 'closingRank' },
  ],

  urlPath: '/predictors/clat-predictor',
};
