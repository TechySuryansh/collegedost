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
    'MBA', 'PGDM', 'Executive MBA', 'Integrated MBA',
    'Business Analytics', 'MBA Specializations', 'PhD (Management)'
  ],
  rankBasedPrograms: [
    'MBA', 'PGDM', 'Executive MBA', 'Integrated MBA',
    'Business Analytics', 'MBA Specializations'
  ],

  steps: [
    { number: 1, label: 'Score & Program' },
    { number: 2, label: 'Category' },
  ],

  sidebarFilters: {
    quotaTypes: [
      { label: 'General / Non-IIM', value: 'General', defaultChecked: true },
      { label: 'Category Quota', value: 'Category', defaultChecked: true },
    ],
    institutionTypes: [
      { label: 'IIMs (Old & New)', value: 'IIM', defaultChecked: true },
      { label: 'IITs / NITs (MBA)', value: 'IIT-NIT', defaultChecked: true },
      { label: 'Tier 1 Private (MDI/FMS/SPJIMR)', value: 'Tier 1 Private', defaultChecked: true },
      { label: 'Tier 2 Private (IMT/IMI)', value: 'Tier 2 Private', defaultChecked: true },
    ],
    branchInterests: [
      { label: 'General Management', value: 'General Management', defaultChecked: true },
      { label: 'Finance', value: 'Finance', defaultChecked: true },
      { label: 'Marketing', value: 'Marketing', defaultChecked: true },
      { label: 'Business Analytics', value: 'Business Analytics', defaultChecked: true },
      { label: 'Human Resource Management', value: 'Human Resource', defaultChecked: true },
      { label: 'Operations Management', value: 'Operations', defaultChecked: true },
      { label: 'IT & Systems', value: 'IT & Systems', defaultChecked: true },
      { label: 'Supply Chain', value: 'Supply Chain', defaultChecked: true },
      { label: 'Entrepreneurship', value: 'Entrepreneurship', defaultChecked: true },
      { label: 'International Business', value: 'International Business', defaultChecked: true },
    ],
    programTypes: [
      { label: 'MBA / PGDM', value: 'Main', defaultChecked: true },
      { label: 'Executive / PhD', value: 'Adv', defaultChecked: true },
    ],
  },

  apiConfig: {
    predictEndpoint: '/colleges/predict',
    predictMethod: 'GET',
    buildRequestPayload: (input) => {
      _lastUserPercentile = input.value;
      return {
        rank: input.value,
        exam: 'CAT',
        category: input.category,
      };
    },

    parseResponse: (response: any): NormalizedPrediction => {
      const colleges: FlatCollege[] = [];
      const score = _lastUserPercentile;

      for (const item of response.data || []) {
        const instName = item.name || '';
        const slug = instName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const locationStr = `${item.location?.city || ''}, ${item.location?.state || ''}`;

        let abbrev = 'MBA';
        let derivedInstType = 'Tier 2 Private';

        if (instName.includes('Indian Institute of Management') || instName.includes('IIM')) {
          abbrev = 'IIM'; derivedInstType = 'IIM';
        } else if (instName.includes('Indian Institute of Technology') || instName.includes('IIT') ||
          instName.includes('National Institute of Technology') || instName.includes('NIT')) {
          abbrev = 'IIT'; derivedInstType = 'IIT-NIT';
        } else if (/MDI|FMS|SPJIMR|XLRI|ISB|IIFT|JBIMS/.test(instName)) {
          abbrev = instName.match(/MDI|FMS|SPJIMR|XLRI|ISB|IIFT|JBIMS/)?.[0] || 'T1';
          derivedInstType = 'Tier 1 Private';
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
            collegeSlug: slug,
            institutionAbbrev: abbrev,
            location: locationStr,
            course: cut.branch || 'Management Program',
            quota: cut.quota || 'General',
            closingRank: cutoff,
            cutoffLabel: 'CAT Percentile',
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
    { label: 'Cutoff Percentile (High to Low)', value: 'closingRank' },
  ],

  urlPath: '/predictors/cat-predictor',
};
