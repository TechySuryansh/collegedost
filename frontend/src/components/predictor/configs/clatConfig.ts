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
  states: [],
  genders: ['Male', 'Female', 'Neutral'],
  programTypes: [
    'BA LLB (Hons.)', 'BBA LLB', 'B.Com LLB', 'B.Sc LLB',
    'LLM (Specializations)', 'PhD in Law'
  ],
  rankBasedPrograms: [
    'BA LLB (Hons.)', 'BBA LLB', 'B.Com LLB', 'B.Sc LLB',
    'LLM (Specializations)'
  ],

  steps: [
    { number: 1, label: 'Program & Rank' },
    { number: 2, label: 'Category & Gender' },
  ],

  sidebarFilters: {
    quotaTypes: [
      { label: 'All India Quota', value: 'AI', defaultChecked: true },
      { label: 'Domicile / State Quota', value: 'Domicile', defaultChecked: true },
      { label: 'NRI / Foreign Quota', value: 'NRI', defaultChecked: true },
    ],
    institutionTypes: [
      { label: 'National Law Universities (NLUs)', value: 'NLU', defaultChecked: true },
      { label: 'Top Private Law Schools (JGLS/ILS)', value: 'Private', defaultChecked: true },
    ],
    branchInterests: [
      { label: 'Constitutional Law', value: 'Constitutional', defaultChecked: true },
      { label: 'Criminal Law', value: 'Criminal', defaultChecked: true },
      { label: 'Corporate Law', value: 'Corporate', defaultChecked: true },
      { label: 'Human Rights', value: 'Human Rights', defaultChecked: true },
      { label: 'IPR / Cyber Law', value: 'IPR', defaultChecked: true },
      { label: 'Environmental Law', value: 'Environmental', defaultChecked: true },
      { label: 'International Law', value: 'International', defaultChecked: true },
      { label: 'Tax Law', value: 'Tax', defaultChecked: true },
    ],
    programTypes: [
      { label: 'Undergraduate (BA/BBA LLB)', value: 'UG', defaultChecked: true },
      { label: 'Postgraduate (LLM)', value: 'PG', defaultChecked: true },
    ],
  },

  apiConfig: {
    predictEndpoint: '/colleges/predict',
    predictMethod: 'GET',
    buildRequestPayload: (input) => {
      _lastUserRank = input.value;
      return {
        rank: input.value,
        exam: 'CLAT',
        category: input.category,
        gender: input.gender,
      };
    },

    parseResponse: (response: any): NormalizedPrediction => {
      const colleges: FlatCollege[] = [];
      const rank = _lastUserRank;

      for (const item of response.data || []) {
        const instName = item.name || '';
        const slug = instName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const locationStr = `${item.location?.city || ''}, ${item.location?.state || ''}`;

        let abbrev = 'Law';
        let derivedInstType = 'Private';

        if (instName.includes('National Law') || instName.includes('NLU')) {
          abbrev = 'NLU'; derivedInstType = 'NLU';
        } else if (/JGLS|Jindal|ILS|Symbiosis/.test(instName)) {
          abbrev = 'PVT'; derivedInstType = 'Private';
        }

        for (const cut of item.matchingCutoffs || []) {
          const cutoff = cut.closing || cut.closingRank || 0;

          let chance: AdmissionChance = 'not-eligible';
          if (rank <= cutoff) chance = 'high';
          else if (rank <= cutoff * 1.05) chance = 'medium';
          else if (rank <= cutoff * 1.15) chance = 'low';

          colleges.push({
            id: `${item._id}-${cut.branch}-${cut.quota}-${cutoff}`,
            collegeName: instName,
            collegeSlug: slug,
            institutionAbbrev: abbrev,
            location: locationStr,
            course: cut.branch || 'Law Program',
            quota: cut.quota || 'AI',
            closingRank: cutoff,
            cutoffLabel: 'Closing Rank',
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
    { label: 'Closing Rank (Low to High)', value: 'closingRank' },
  ],

  urlPath: '/predictors/clat-predictor',
};
