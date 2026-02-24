import type { PredictorConfig, FlatCollege, NormalizedPrediction } from '../types';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir',
  'Ladakh', 'Chandigarh', 'Puducherry', 'Andaman and Nicobar Islands',
];

// ─── Shared parsing helpers ───────────────────────────────────────────

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

function getMedType(name: string, type: string): { instType: string; abbrev: string } {
  const n = (name || '').toLowerCase();
  const t = (type || '').toLowerCase();
  if (n.includes('aiims') || n.includes('all india institute of medical')) return { instType: 'AIIMS', abbrev: 'AIIMS' };
  if (n.includes('jipmer')) return { instType: 'JIPMER', abbrev: 'JIPMER' };
  if (n.includes('pgimer')) return { instType: 'PGIMER', abbrev: 'PGI' };
  if (n.includes('nimhans')) return { instType: 'NIMHANS', abbrev: 'NIM' };
  if (t.includes('private') || t.includes('deemed')) return { instType: 'Private', abbrev: 'PVT' };
  return { instType: 'Govt Medical', abbrev: 'GMC' };
}

function calculateChance(userRank: number, closingRank: number): 'high' | 'medium' | 'low' {
  if (!closingRank || closingRank === 0) return 'medium';
  if (closingRank > userRank * 1.2) return 'high';
  if (closingRank >= userRank * 0.85) return 'medium';
  return 'low';
}

const QUOTA_MAP: Record<string, string> = {
  AI: 'All India',
  HS: 'Home State',
  OS: 'Other State',
};

let _lastScore = 0;
let _lastRank = 0;
let _lastUserState = '';

// Estimate NEET rank from score
function scoreToRank(score: number): number {
  if (score >= 715) return Math.max(1, Math.floor((720 - score) * 10));
  if (score >= 700) return Math.floor((720 - score) * 200) + 50;
  if (score >= 680) return Math.floor((700 - score) * 500) + 2000;
  if (score >= 650) return Math.floor((680 - score) * 1000) + 12000;
  if (score >= 600) return Math.floor((650 - score) * 1500) + 42000;
  if (score >= 550) return Math.floor((600 - score) * 2000) + 117000;
  if (score >= 500) return Math.floor((550 - score) * 3000) + 217000;
  return Math.floor((500 - score) * 5000) + 367000;
}

function parseNEETResponse(data: Record<string, unknown>): NormalizedPrediction {
  const raw = data as unknown as RawResponse;
  const colleges: FlatCollege[] = [];
  const userRank = _lastRank > 0 ? _lastRank : scoreToRank(_lastScore);

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
      const chance = userRank > 0 ? calculateChance(userRank, closingRank) : 'medium';
      const { instType, abbrev } = getMedType(college.name || '', college.type || '');
      const quotaLabel = QUOTA_MAP[cutQuota] || 'All India';

      colleges.push({
        id: `${college._id}-${cut.branch}-${closingRank}-${cutQuota}`,
        collegeName: college.name || 'Unknown College',
        location: locationStr,
        nirfRank: college.nirfRank,
        course: cut.branch || 'MBBS',
        quota: quotaLabel,
        closingRank,
        chance,
        institutionType: instType,
        institutionAbbrev: abbrev,
      });
    }
  }

  colleges.sort((a, b) => {
    const o = { high: 1, medium: 2, low: 3 };
    const d = o[a.chance] - o[b.chance];
    return d !== 0 ? d : (a.closingRank || 0) - (b.closingRank || 0);
  });

  return {
    success: raw.success,
    totalResults: colleges.length,
    colleges,
    summary: {
      high: colleges.filter(c => c.chance === 'high').length,
      medium: colleges.filter(c => c.chance === 'medium').length,
      low: colleges.filter(c => c.chance === 'low').length,
    },
  };
}

// ─── NEET Config ──────────────────────────────────────────────────────

export const neetConfig: PredictorConfig = {
  examName: 'NEET UG',
  examSlug: 'neet-ug',
  year: 2026,
  pageTitle: 'NEET UG College Predictor 2026',
  pageSubtitle: 'Based on previous year NEET counselling cutoff data',

  inputConfig: {
    label: 'NEET Score (out of 720)',
    placeholder: 'Enter Score (e.g. 650)',
    type: 'score',
    min: 0,
    max: 720,
    step: 1,
    validationMessage: 'Please enter a valid NEET Score (0 - 720)',
  },

  categories: ['General', 'OBC-NCL', 'SC', 'ST', 'EWS'],
  states: INDIAN_STATES,
  genders: ['Male', 'Female'],

  steps: [
    { number: 1, label: 'NEET Score' },
    { number: 2, label: 'Category & State' },
    { number: 3, label: 'Recommendations' },
  ],

  sidebarFilters: {
    quotaTypes: [
      { label: 'All India Quota', value: 'All India', defaultChecked: true },
      { label: 'Home State Quota', value: 'Home State', defaultChecked: false },
      { label: 'Other State Quota', value: 'Other State', defaultChecked: false },
    ],
    institutionTypes: [
      { label: 'Govt Medical Colleges', value: 'Govt', defaultChecked: true },
      { label: 'AIIMS', value: 'AIIMS', defaultChecked: true },
      { label: 'JIPMER / PGIMER', value: 'JIPMER', defaultChecked: true },
      { label: 'Private Medical', value: 'Private', defaultChecked: true },
    ],
    branchInterests: [
      { label: 'MBBS', value: 'MBBS', defaultChecked: true },
      { label: 'BDS', value: 'BDS', defaultChecked: true },
    ],
  },

  apiConfig: {
    predictEndpoint: '/colleges/predict',
    predictMethod: 'GET',
    buildRequestPayload: (input) => {
      _lastScore = input.value;
      _lastRank = scoreToRank(input.value);
      _lastUserState = input.homeState || '';
      return {
        rank: scoreToRank(input.value),
        exam: 'NEET',
        category: input.category,
        state: input.homeState,
      };
    },
    parseResponse: parseNEETResponse,
  },

  sortOptions: [
    { label: 'Admission Chance', value: 'chance' },
    { label: 'Closing Rank (Low to High)', value: 'closingRank' },
    { label: 'NIRF Rank', value: 'nirfRank' },
  ],

  urlPath: '/predictors/neet-predictor',
};
