import type { PredictorConfig, FlatCollege, NormalizedPrediction } from '../types';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir',
];

// ─── Parsing ──────────────────────────────────────────────────────────

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

function getInstType(name: string, type: string): { instType: string; abbrev: string } {
  const n = (name || '').toLowerCase();
  const t = (type || '').toLowerCase();
  if (n.includes('indian institute of technology') || (n.includes('iit') && !n.includes('iiit'))) return { instType: 'IIT', abbrev: 'IIT' };
  if (n.includes('indian institute of information technology') || n.includes('iiit')) return { instType: 'IIIT', abbrev: 'IIIT' };
  if (n.includes('national institute of technology') || n.startsWith('nit ')) return { instType: 'NIT', abbrev: 'NIT' };
  if (t.includes('private') || t.includes('deemed')) return { instType: 'Private', abbrev: 'PVT' };
  if (t.includes('government')) return { instType: 'GFTI', abbrev: 'GFTI' };
  return { instType: type || 'Other', abbrev: type?.slice(0, 3).toUpperCase() || 'COL' };
}

function calculateChance(userRank: number, closingRank: number): 'high' | 'medium' | 'low' {
  if (!closingRank || closingRank === 0) return 'medium';
  if (closingRank > userRank * 1.2) return 'high';
  if (closingRank >= userRank * 0.85) return 'medium';
  return 'low';
}

// JEE Main score (out of 300) to approximate rank
function jeeScoreToRank(score: number): number {
  if (score >= 290) return Math.max(1, Math.floor((300 - score) * 10));
  if (score >= 250) return Math.floor((290 - score) * 50) + 100;
  if (score >= 200) return Math.floor((250 - score) * 200) + 2100;
  if (score >= 150) return Math.floor((200 - score) * 500) + 12100;
  if (score >= 100) return Math.floor((150 - score) * 1000) + 37100;
  return Math.floor((100 - score) * 2000) + 87100;
}

const QUOTA_MAP: Record<string, string> = { AI: 'All India', HS: 'Home State', OS: 'Other State' };
let _lastRank = 0;

function parseRankResponse(data: Record<string, unknown>): NormalizedPrediction {
  const raw = data as unknown as RawResponse;
  const colleges: FlatCollege[] = [];

  for (const college of raw.data || []) {
    const loc = college.location;
    const locationStr = loc ? [loc.city, loc.state].filter(Boolean).join(', ') : '';

    for (const cut of college.matchingCutoffs || []) {
      const closingRank = cut.closing || 0;
      const chance = _lastRank > 0 ? calculateChance(_lastRank, closingRank) : 'medium';
      const { instType, abbrev } = getInstType(college.name || '', college.type || '');
      const quotaLabel = QUOTA_MAP[cut.quota || 'AI'] || 'All India';

      colleges.push({
        id: `${college._id}-${cut.branch}-${closingRank}-${cut.quota}`,
        collegeName: college.name || 'Unknown College',
        location: locationStr,
        nirfRank: college.nirfRank,
        course: cut.branch || 'General',
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
    estimatedRank: _lastRank,
  };
}

// ─── Rank Predictor Config ────────────────────────────────────────────

export const rankPredictorConfig: PredictorConfig = {
  examName: 'JEE Main Rank',
  examSlug: 'jee-rank',
  year: 2026,
  pageTitle: 'Rank Predictor 2026',
  pageSubtitle: 'Estimate your rank based on your expected score and see matching colleges',

  inputConfig: {
    label: 'Your Score (out of 300)',
    placeholder: 'Enter Score (e.g. 250)',
    type: 'score',
    min: 0,
    max: 300,
    step: 1,
    validationMessage: 'Please enter a valid score (0-300)',
  },

  categories: ['General', 'OBC-NCL', 'SC', 'ST', 'EWS'],
  states: INDIAN_STATES,
  genders: ['Male', 'Female'],

  steps: [
    { number: 1, label: 'Enter Score' },
    { number: 2, label: 'Category' },
    { number: 3, label: 'Rank Estimate' },
  ],

  sidebarFilters: {
    quotaTypes: [
      { label: 'All India Quota', value: 'All India', defaultChecked: true },
    ],
    institutionTypes: [
      { label: 'IITs', value: 'IIT', defaultChecked: true },
      { label: 'NITs', value: 'NIT', defaultChecked: true },
      { label: 'IIITs', value: 'IIIT', defaultChecked: true },
      { label: 'GFTIs', value: 'GFTI', defaultChecked: false },
    ],
    branchInterests: [
      { label: 'Computer Science', value: 'Computer', defaultChecked: true },
      { label: 'Electronics', value: 'Electron', defaultChecked: false },
      { label: 'Mechanical', value: 'Mechanic', defaultChecked: false },
    ],
  },

  apiConfig: {
    predictEndpoint: '/colleges/predict',
    predictMethod: 'GET',
    buildRequestPayload: (input) => {
      _lastRank = jeeScoreToRank(input.value);
      return {
        rank: _lastRank,
        exam: 'JEE Main',
        category: input.category,
        state: input.homeState,
      };
    },
    parseResponse: parseRankResponse,
  },

  sortOptions: [
    { label: 'Admission Chance', value: 'chance' },
    { label: 'Closing Rank (Low to High)', value: 'closingRank' },
  ],

  urlPath: '/predictors/rank-predictor',
};
