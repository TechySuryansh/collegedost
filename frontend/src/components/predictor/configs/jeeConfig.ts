import type { PredictorConfig, FlatCollege, NormalizedPrediction, AdmissionChance } from '../types';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir',
  'Ladakh', 'Chandigarh', 'Puducherry', 'Andaman and Nicobar Islands',
  'Dadra and Nagar Haveli and Daman and Diu', 'Lakshadweep',
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
  if (t.includes('university')) return { instType: 'University', abbrev: 'UNI' };
  return { instType: type || 'Other', abbrev: 'UNI' };
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

let _lastUserRank = 0;
let _lastUserState = '';

function parseResponse(data: Record<string, unknown>): NormalizedPrediction {
  const raw = data as unknown as RawResponse;
  const colleges: FlatCollege[] = [];

  for (const college of raw.data || []) {
    const loc = college.location;
    const locationStr = loc ? [loc.city, loc.state].filter(Boolean).join(', ') : '';
    const collegeState = (loc?.state || '').toLowerCase();
    const userState = _lastUserState.toLowerCase();

    for (const cut of college.matchingCutoffs || []) {
      const cutQuota = cut.quota || 'AI';

      // Filter HS/OS by college state vs user state
      if (cutQuota === 'HS' && userState && collegeState !== userState) continue;
      if (cutQuota === 'OS' && userState && collegeState === userState) continue;

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

  // Sort by chance (high first) then closing rank
  colleges.sort((a, b) => {
    const o: Record<AdmissionChance, number> = { high: 1, medium: 2, low: 3, 'not-eligible': 4 };
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
      'not-eligible': colleges.filter(c => c.chance === 'not-eligible').length,
    },
  };
}

// ─── JEE Main Config ──────────────────────────────────────────────────

export const jeeConfig: PredictorConfig = {
  examName: 'JEE Main',
  examSlug: 'jee-main',
  year: 2026,
  pageTitle: 'JEE Main College Predictor 2026',
  pageSubtitle: 'Based on previous year opening & closing ranks',

  inputConfig: {
    label: 'JEE Main Rank',
    placeholder: 'Enter Rank (e.g. 15000)',
    type: 'rank',
    min: 1,
    max: 1500000,
    step: 1,
    validationMessage: 'Please enter a valid JEE Main Rank (1 - 15,00,000)',
  },

  categories: ['General', 'OBC-NCL', 'SC', 'ST', 'EWS'],
  states: INDIAN_STATES,
  genders: ['Male', 'Female'],
  programTypes: ['B.E. / B.Tech', 'Dual Degree'],

  steps: [
    { number: 1, label: 'Exam Details' },
    { number: 2, label: 'Category & State' },
    { number: 3, label: 'Recommendations' },
  ],

  sidebarFilters: {
    quotaTypes: [
      { label: 'All India Quota', value: 'All India', defaultChecked: true },
      { label: 'Home State Quota', value: 'Home State', defaultChecked: true },
      { label: 'Other State Quota', value: 'Other State', defaultChecked: true },
    ],
    institutionTypes: [
      { label: 'IITs', value: 'IIT', defaultChecked: true },
      { label: 'NITs', value: 'NIT', defaultChecked: true },
      { label: 'IIITs', value: 'IIIT', defaultChecked: true },
      { label: 'GFTIs', value: 'GFTI', defaultChecked: true },
      { label: 'Private / Deemed', value: 'PVT', defaultChecked: true },
      { label: 'University / Other', value: 'UNI', defaultChecked: true },
    ],
    branchInterests: [
      { label: 'Computer Science (CSE)', value: 'Computer', defaultChecked: true },
      { label: 'CSE (AI & Machine Learning)', value: 'Artificial Intelligence', defaultChecked: true },
      { label: 'CSE (Data Science)', value: 'Data Science', defaultChecked: true },
      { label: 'CSE (Cyber Security)', value: 'Cyber', defaultChecked: true },
      { label: 'CSE (IoT)', value: 'Internet of Things', defaultChecked: true },
      { label: 'Software Engineering', value: 'Software', defaultChecked: true },
      { label: 'Information Technology (IT)', value: 'Information Technology', defaultChecked: true },
      { label: 'Electronics & Communication (ECE)', value: 'Electron', defaultChecked: true },
      { label: 'Electrical Engineering (EE)', value: 'Electric', defaultChecked: true },
      { label: 'Mechanical Engineering', value: 'Mechanic', defaultChecked: true },
      { label: 'Civil Engineering', value: 'Civil', defaultChecked: true },
      { label: 'Chemical Engineering', value: 'Chemical', defaultChecked: true },
      { label: 'Metallurgical Engineering', value: 'Metallurg', defaultChecked: true },
      { label: 'Aerospace / Avionics', value: 'Aero', defaultChecked: true },
      { label: 'Biotechnology', value: 'Biotech', defaultChecked: true },
      { label: 'Mathematics & Computing', value: 'Mathematics', defaultChecked: true },
      { label: 'Engineering Physics', value: 'Engineering Physics', defaultChecked: true },
      { label: 'Instrumentation', value: 'Instrument', defaultChecked: true },
      { label: 'Production / Industrial', value: 'Production', defaultChecked: true },
      { label: 'Mining Engineering', value: 'Mining', defaultChecked: true },
      { label: 'Ocean / Naval Architecture', value: 'Ocean', defaultChecked: true },
      { label: 'Architecture / Planning', value: 'Architect', defaultChecked: true },
      { label: 'Pharmaceutical / Pharmacy', value: 'Pharma', defaultChecked: true },
    ],
    programTypes: [],
  },

  apiConfig: {
    predictEndpoint: '/colleges/predict',
    predictMethod: 'GET',
    buildRequestPayload: (input) => {
      _lastUserRank = input.value;
      _lastUserState = input.homeState || '';
      return {
        rank: input.value,
        exam: 'JEE Main',
        category: input.category,
        state: input.homeState,
      };
    },
    parseResponse,
  },

  sortOptions: [
    { label: 'Admission Chance', value: 'chance' },
    { label: 'Closing Rank (Low to High)', value: 'closingRank' },
    { label: 'NIRF Rank', value: 'nirfRank' },
  ],

  urlPath: '/predictors/jee-main-predictor',
};
