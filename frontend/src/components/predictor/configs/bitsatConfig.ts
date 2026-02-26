import type { PredictorConfig, FlatCollege, NormalizedPrediction, AdmissionChance } from '../types';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir',
  'Ladakh', 'Chandigarh', 'Puducherry', 'Andaman and Nicobar Islands',
];

interface BitsatResult {
  college_name: string;
  college_slug: string;
  course: string;
  cutoff_score: number;
  chance: string;
}

interface BitsatResponse {
  success: boolean;
  predictionId?: string;
  results: Record<string, Record<string, BitsatResult[]>>;
}

function parseBITSATResponse(data: Record<string, unknown>): NormalizedPrediction {
  const raw = data as unknown as BitsatResponse;
  const colleges: FlatCollege[] = [];

  const campusMetadata: Record<string, { location: string; nirf?: number; abbrev: string }> = {
    'BITS_Pilani': { location: 'Pilani, Rajasthan', nirf: 25, abbrev: 'BITSP' },
    'BITS_Goa': { location: 'Goa', nirf: 30, abbrev: 'BITSG' },
    'BITS_Hyderabad': { location: 'Hyderabad, Telangana', nirf: 28, abbrev: 'BITSH' }
  };

  const chanceMap: Record<string, AdmissionChance> = {
    'good_chances': 'high',
    'may_get': 'medium',
    'tough_chances': 'low'
  };

  if (raw.results) {
    Object.entries(raw.results).forEach(([campus, groups]) => {
      const meta = campusMetadata[campus] || { location: 'India', nirf: 0, abbrev: 'BITS' };

      Object.entries(groups).forEach(([chanceKey, list]) => {
        const chance = chanceMap[chanceKey] || 'low';

        list.forEach((item) => {
          colleges.push({
            id: `${item.college_slug}-${item.course}-${item.cutoff_score}`,
            collegeName: item.college_name,
            location: meta.location,
            nirfRank: meta.nirf,
            course: item.course,
            quota: 'All India',
            closingRank: item.cutoff_score,
            chance,
            institutionType: 'BITS Campus',
            institutionAbbrev: meta.abbrev,
          });
        });
      });
    });
  }

  // Sort by chance (high to low) then by cutoff score (high to low)
  colleges.sort((a, b) => {
    const o: Record<AdmissionChance, number> = { high: 1, medium: 2, low: 3, 'not-eligible': 4 };
    const d = o[a.chance] - o[b.chance];
    if (d !== 0) return d;
    return b.closingRank - a.closingRank;
  });

  return {
    success: raw.success,
    predictionId: raw.predictionId,
    totalResults: colleges.length,
    colleges,
    summary: {
      high: colleges.filter(c => c.chance === 'high').length,
      medium: colleges.filter(c => c.chance === 'medium').length,
      low: colleges.filter(c => c.chance === 'low').length,
      'not-eligible': colleges.filter(c => c.chance === 'not-eligible').length,
    },
  };
}

export const bitsatConfig: PredictorConfig = {
  examName: 'BITSAT',
  examSlug: 'bitsat',
  year: 2026,
  pageTitle: 'BITSAT College Predictor 2026',
  pageSubtitle: 'Get the most accurate campus and branch predictions for BITS Pilani campuses',

  inputConfig: {
    label: 'BITSAT Score (out of 390)',
    placeholder: 'Enter your score (e.g. 310)',
    type: 'score',
    min: 0,
    max: 390,
    step: 1,
    validationMessage: 'Please enter a valid BITSAT score (0-390)',
  },

  categories: ['General'], // BITS only has General category for BITSAT
  states: [], // BITSAT is a national merit-based exam with no state quota
  genders: ['Male', 'Female'],

  programTypes: ['B.E.', 'B.Pharm', 'Integrated M.Sc.'],
  steps: [
    { number: 1, label: 'Score' },
    { number: 2, label: 'Preferences' },
    { number: 3, label: 'Recommendations' },
  ],

  sidebarFilters: {
    quotaTypes: [
      { label: 'All India Quota', value: 'All India', defaultChecked: true },
    ],
    institutionTypes: [
      { label: 'BITS Pilani (Main)', value: 'BITSP', defaultChecked: true },
      { label: 'BITS Goa', value: 'BITSG', defaultChecked: true },
      { label: 'BITS Hyderabad', value: 'BITSH', defaultChecked: true },
    ],
    branchInterests: [
      { label: 'Computer Science', value: 'Computer Science', defaultChecked: true },
      { label: 'Electronics', value: 'Electronics', defaultChecked: true },
      { label: 'Electrical', value: 'Electrical', defaultChecked: true },
      { label: 'Mechanical', value: 'Mechanical', defaultChecked: true },
      { label: 'Chemical', value: 'Chemical', defaultChecked: true },
      { label: 'Civil', value: 'Civil', defaultChecked: true },
      { label: 'B.Pharm', value: 'B.Pharm', defaultChecked: true },
      { label: 'M.Sc. Economics', value: 'Economics', defaultChecked: true },
      { label: 'M.Sc. Physics', value: 'Physics', defaultChecked: true },
      { label: 'M.Sc. Mathematics', value: 'Mathematics', defaultChecked: true },
      { label: 'M.Sc. Chemistry', value: 'Chemistry', defaultChecked: true },
      { label: 'M.Sc. Biology', value: 'Biological', defaultChecked: true },
    ],
    programTypes: [
      { label: 'B.E.', value: 'B.E.', defaultChecked: true },
      { label: 'B.Pharm', value: 'B.Pharm', defaultChecked: true },
      { label: 'Integrated M.Sc.', value: 'M.Sc.', defaultChecked: true },
    ],
  },

  apiConfig: {
    predictEndpoint: '/predictor/bitsat-predict',
    predictMethod: 'POST',
    buildRequestPayload: (input) => ({
      score: input.value,
      category: input.category,
      gender: input.gender,
    }),
    parseResponse: parseBITSATResponse,
    loadPredictionEndpoint: '/predictor/prediction',
  },

  sortOptions: [
    { label: 'Admission Chance', value: 'chance' },
    { label: 'Cutoff Score', value: 'closingRank' },
    { label: 'NIRF Rank', value: 'nirfRank' },
  ],

  urlPath: '/predictors/bitsat-predictor',
};
