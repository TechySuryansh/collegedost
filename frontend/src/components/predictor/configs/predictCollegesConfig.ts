import type { PredictorConfig, FlatCollege, NormalizedPrediction, AdmissionChance } from '../types';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir',
];

interface GenericCollegeRaw {
  _id?: string;
  name?: string;
  slug?: string;
  location?: { city?: string; state?: string };
  type?: string;
  nirfRank?: number;
  matchingCutoffs?: Array<{
    branch?: string;
    closing?: number;
    opening?: number;
    category?: string;
    quota?: string;
  }>;
}

interface GenericRawResponse {
  success: boolean;
  data?: GenericCollegeRaw[];
  count?: number;
}

function getInstType(name: string, type: string): { instType: string; abbrev: string } {
  const n = (name || '').toLowerCase();
  const t = (type || '').toLowerCase();
  if (n.includes('indian institute of technology') || (n.includes('iit') && !n.includes('iiit'))) return { instType: 'IIT', abbrev: 'IIT' };
  if (n.includes('indian institute of information technology') || n.includes('iiit')) return { instType: 'IIIT', abbrev: 'IIIT' };
  if (n.includes('national institute of technology') || n.startsWith('nit ')) return { instType: 'NIT', abbrev: 'NIT' };
  if (n.includes('aiims') || n.includes('all india institute of medical')) return { instType: 'AIIMS', abbrev: 'AIIMS' };
  if (n.includes('jipmer')) return { instType: 'JIPMER', abbrev: 'JIPMER' };
  if (t.includes('private') || t.includes('deemed')) return { instType: 'Private', abbrev: 'PVT' };
  if (t.includes('government')) return { instType: 'GFTI', abbrev: 'GFTI' };
  return { instType: type || 'Other', abbrev: type?.slice(0, 3).toUpperCase() || 'COL' };
}

function calculateChance(userRank: number, closingRank: number): AdmissionChance {
  if (!closingRank || closingRank === 0) return 'medium';
  // If closing rank > user rank * 1.2 → high chance (college accepts worse ranks)
  // If closing rank is between rank * 0.85 and rank * 1.2 → medium chance
  // If closing rank < rank * 0.85 → low chance (college is more competitive)
  if (closingRank > userRank * 1.2) return 'high';
  if (closingRank >= userRank * 0.85) return 'medium';
  return 'low';
}

// Map backend quota codes to frontend filter labels
const QUOTA_MAP: Record<string, string> = {
  AI: 'All India',
  HS: 'Home State',
  OS: 'Other State',
};

// Store user input in module-level variables for parseResponse
let _lastUserRank = 0;
let _lastUserState = '';

function parseGenericResponse(data: Record<string, unknown>): NormalizedPrediction {
  const raw = data as unknown as GenericRawResponse;
  const colleges: FlatCollege[] = [];

  for (const college of raw.data || []) {
    const loc = college.location;
    const locationStr = loc ? [loc.city, loc.state].filter(Boolean).join(', ') : '';
    const collegeState = (loc?.state || '').toLowerCase();
    const userState = _lastUserState.toLowerCase();

    for (const cut of college.matchingCutoffs || []) {
      const cutQuota = cut.quota || 'AI';

      // Filter HS/OS cutoffs based on the college's state vs user's state
      if (cutQuota === 'HS' && userState && collegeState !== userState) {
        // Skip Home State cutoffs for colleges NOT in user's state
        continue;
      }
      if (cutQuota === 'OS' && userState && collegeState === userState) {
        // Skip Other State cutoffs for colleges IN user's state
        // (user would use HS quota for their own state)
        continue;
      }

      const closingRank = cut.closing || 0;
      const chance = _lastUserRank > 0 ? calculateChance(_lastUserRank, closingRank) : 'medium';
      const { instType, abbrev } = getInstType(college.name || '', college.type || '');
      const quotaLabel = QUOTA_MAP[cutQuota] || 'All India';

      colleges.push({
        id: `${college._id}-${cut.branch}-${closingRank}-${cut.category}-${cutQuota}`,
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

  // Sort by chance (high first) then by closing rank
  colleges.sort((a, b) => {
    const chanceOrder: Record<AdmissionChance, number> = { high: 1, medium: 2, low: 3, 'not-eligible': 4 };
    const chanceDiff = chanceOrder[a.chance] - chanceOrder[b.chance];
    if (chanceDiff !== 0) return chanceDiff;
    return (a.closingRank || 0) - (b.closingRank || 0);
  });

  return {
    success: raw.success,
    totalResults: colleges.length,
    colleges,
    summary: {
      high: colleges.filter((c) => c.chance === 'high').length,
      medium: colleges.filter((c) => c.chance === 'medium').length,
      low: colleges.filter((c) => c.chance === 'low').length,
      'not-eligible': colleges.filter((c) => c.chance === 'not-eligible').length,
    },
  };
}

export const predictCollegesConfig: PredictorConfig = {
  examName: 'College Predictor',
  examSlug: 'college-predictor',
  year: 2026,
  pageTitle: 'College Predictor 2026',
  pageSubtitle: 'Enter your rank and category to find colleges you can get into',

  inputConfig: {
    label: 'Your Rank',
    placeholder: 'Enter Rank (e.g. 15000)',
    type: 'rank',
    min: 1,
    max: 1500000,
    step: 1,
    validationMessage: 'Please enter a valid rank',
  },

  categories: ['General', 'OBC-NCL', 'SC', 'ST', 'EWS'],
  states: INDIAN_STATES,
  genders: ['Male', 'Female'],
  programTypes: ['B.E. / B.Tech', 'Medical', 'Management'],

  steps: [
    { number: 1, label: 'Exam Details' },
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
      { label: 'IITs', value: 'IIT', defaultChecked: true },
      { label: 'NITs', value: 'NIT', defaultChecked: true },
      { label: 'IIITs', value: 'IIIT', defaultChecked: true },
      { label: 'GFTIs', value: 'GFTI', defaultChecked: false },
      { label: 'Private / Deemed', value: 'PVT', defaultChecked: false },
    ],
    branchInterests: [
      { label: 'Computer Science', value: 'Computer', defaultChecked: true },
      { label: 'Electronics', value: 'Electron', defaultChecked: false },
      { label: 'Mechanical', value: 'Mechanic', defaultChecked: false },
      { label: 'Civil', value: 'Civil', defaultChecked: false },
      { label: 'Electrical', value: 'Electric', defaultChecked: false },
    ],
    programTypes: [
      { label: 'B.E. / B.Tech', value: 'B.E.', defaultChecked: true },
    ],
  },

  apiConfig: {
    predictEndpoint: '/colleges/predict',
    predictMethod: 'GET',
    buildRequestPayload: (input) => {
      // Store user input for the parseResponse function
      _lastUserRank = input.value;
      _lastUserState = input.homeState || '';
      return {
        rank: input.value,
        exam: 'JEE Main',
        category: input.category,
        state: input.homeState,
      };
    },
    parseResponse: parseGenericResponse,
  },

  sortOptions: [
    { label: 'Admission Chance', value: 'chance' },
    { label: 'Closing Rank (Low to High)', value: 'closingRank' },
    { label: 'NIRF Rank', value: 'nirfRank' },
  ],

  urlPath: '/predictors/predict-colleges',
};
