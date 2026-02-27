import type { PredictorConfig, FlatCollege, NormalizedPrediction, AdmissionChance } from '../types';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi',
  'Jammu and Kashmir', 'Puducherry',
];

// ─── Shared parsing ───────────────────────────────────────────────────

interface CollegeRaw {
  _id?: string;
  name?: string;
  location?: { city?: string; state?: string };
  type?: string;
  nirfRank?: number;
  matchingCutoffs?: Array<{
    branch?: string;
    closing?: number;
    category?: string;
    quota?: string;
  }>;
}

interface RawResponse {
  success: boolean;
  data?: CollegeRaw[];
  count?: number;
}

function calculateChance(userRank: number, closingRank: number): AdmissionChance {
  if (!closingRank || closingRank === 0) return 'medium';
  if (closingRank > userRank * 1.2) return 'high';
  if (closingRank >= userRank * 0.85) return 'medium';
  return 'low';
}

const QUOTA_MAP: Record<string, string> = { AI: 'All India', HS: 'Home State', OS: 'Other State' };

let _lastUserRank = 0;
let _lastUserState = '';

function parseCUETResponse(data: Record<string, unknown>): NormalizedPrediction {
  const raw = data as unknown as RawResponse;
  const colleges: FlatCollege[] = [];

  for (const college of raw.data || []) {
    const loc = college.location;
    const locationStr = loc ? [loc.city, loc.state].filter(Boolean).join(', ') : '';
    const collegeState = (loc?.state || '').toLowerCase();
    const userState = _lastUserState.toLowerCase();

    for (const cut of college.matchingCutoffs || []) {
      const cutQuota = cut.quota || 'AI';
      if (cutQuota === 'HS' && userState && collegeState !== userState) continue;
      if (cutQuota === 'OS' && userState && collegeState === userState) continue;

      const closingRank = cut.closing || 0;
      const chance = _lastUserRank > 0 ? calculateChance(_lastUserRank, closingRank) : 'medium';
      const quotaLabel = QUOTA_MAP[cutQuota] || 'All India';

      const t = (college.type || '').toLowerCase();
      let instType = 'University';
      let abbrev = 'UNI';
      if (t.includes('central')) { instType = 'Central University'; abbrev = 'CU'; }
      else if (t.includes('state')) { instType = 'State University'; abbrev = 'SU'; }
      else if (t.includes('private') || t.includes('deemed')) { instType = 'Private'; abbrev = 'PVT'; }

      colleges.push({
        id: `${college._id}-${cut.branch}-${closingRank}-${cutQuota}`,
        collegeName: college.name || 'Unknown University',
        collegeSlug: (college.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        location: locationStr,
        nirfRank: college.nirfRank,
        course: cut.branch || 'General Programme',
        quota: quotaLabel,
        closingRank,
        chance,
        institutionType: instType,
        institutionAbbrev: abbrev,
      });
    }
  }

  colleges.sort((a, b) => (a.closingRank || 0) - (b.closingRank || 0));

  return {
    success: raw.success,
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

// ─── CUET Config ──────────────────────────────────────────────────────

export const cuetConfig: PredictorConfig = {
  examName: 'CUET UG',
  examSlug: 'cuet-ug',
  year: 2026,
  pageTitle: 'CUET College Predictor 2026',
  pageSubtitle: 'Based on previous year CUET counselling & cutoff data',

  inputConfig: {
    label: 'CUET-UG Score / Rank',
    placeholder: 'Enter Rank (e.g. 5000)',
    type: 'rank',
    min: 1,
    max: 500000,
    step: 1,
    validationMessage: 'Please enter a valid CUET Rank (1 - 5,00,000)',
  },

  categories: ['General', 'OBC-NCL', 'SC', 'ST', 'EWS'],
  states: INDIAN_STATES,
  genders: ['Male', 'Female'],
  programTypes: ['Undergraduate (UG)', 'Postgraduate (PG)'],

  steps: [
    { number: 1, label: 'Exam Details' },
    { number: 2, label: 'Category & State' },
  ],

  sidebarFilters: {
    quotaTypes: [
      { label: 'All India Quota', value: 'All India', defaultChecked: true },
      { label: 'Home State Quota', value: 'Home State', defaultChecked: false },
    ],
    institutionTypes: [
      { label: 'Central Universities', value: 'Central', defaultChecked: true },
      { label: 'State Universities', value: 'State', defaultChecked: true },
      { label: 'Private Universities', value: 'Private', defaultChecked: false },
      { label: 'Deemed Universities', value: 'Deemed', defaultChecked: false },
    ],
    branchInterests: [
      { label: 'Science', value: 'Science', defaultChecked: true },
      { label: 'Commerce', value: 'Commerce', defaultChecked: false },
      { label: 'Arts / Humanities', value: 'Arts', defaultChecked: false },
    ],
    programTypes: [
      { label: 'Undergraduate (UG)', value: 'UG', defaultChecked: true },
    ],
  },

  apiConfig: {
    predictEndpoint: '/colleges/predict',
    predictMethod: 'GET',
    buildRequestPayload: (input) => {
      _lastUserRank = input.value;
      _lastUserState = input.homeState || '';
      return {
        rank: input.value,
        exam: 'CUET',
        category: input.category,
        state: input.homeState,
      };
    },
    parseResponse: parseCUETResponse,
  },

  sortOptions: [
    { label: 'Cutoff (Low to High)', value: 'closingRank' },
    { label: 'NIRF Rank', value: 'nirfRank' },
  ],

  urlPath: '/predictors/predict-colleges',
};
