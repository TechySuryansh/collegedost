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

interface ViteeeResult {
  college_name: string;
  college_slug: string;
  course: string;
  closing_rank: number;
  category: string;
  chance: AdmissionChance;
}

interface ViteeeResponse {
  success: boolean;
  predictionId?: string;
  results: Record<string, Record<string, ViteeeResult[]>>;
}

function parseVITEEEResponse(data: Record<string, unknown>): NormalizedPrediction {
  const raw = data as unknown as ViteeeResponse;
  const colleges: FlatCollege[] = [];

  const campusMetadata: Record<string, { location: string; nirf?: number; abbrev: string }> = {
    'VIT_Vellore': { location: 'Vellore, Tamil Nadu', nirf: 12, abbrev: 'VIT-V' },
    'VIT_Chennai': { location: 'Chennai, Tamil Nadu', nirf: 18, abbrev: 'VIT-C' },
    'VIT_AP': { location: 'Amaravati, Andhra Pradesh', nirf: 28, abbrev: 'VIT-AP' },
    'VIT_Bhopal': { location: 'Bhopal, Madhya Pradesh', nirf: 35, abbrev: 'VIT-B' }
  };

  if (raw.results) {
    Object.entries(raw.results).forEach(([campus, groups]) => {
      const meta = campusMetadata[campus] || { location: 'India', nirf: 0, abbrev: 'VIT' };

      Object.entries(groups).forEach(([chanceKey, list]) => {
        const chance = chanceKey as AdmissionChance;

        list.forEach((item) => {
          colleges.push({
            id: `${item.college_slug}-${item.course}-${item.closing_rank}-${item.category}`,
            collegeName: item.college_name,
            location: meta.location,
            nirfRank: meta.nirf,
            course: item.course,
            quota: item.category, // Using category as quota label for clarity in VIT
            closingRank: item.closing_rank,
            chance,
            institutionType: 'VIT Campus',
            institutionAbbrev: meta.abbrev,
          });
        });
      });
    });
  }

  // Sort by chance then rank
  colleges.sort((a, b) => {
    const o: Record<AdmissionChance, number> = { high: 1, medium: 2, low: 3, 'not-eligible': 4 };
    const d = o[a.chance] - o[b.chance];
    if (d !== 0) return d;
    return a.closingRank - b.closingRank;
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

export const viteeeConfig: PredictorConfig = {
  examName: 'VITEEE',
  examSlug: 'viteee',
  year: 2026,
  pageTitle: 'VITEEE College Predictor 2026',
  pageSubtitle: 'Predict your admission chances across all VIT campuses for categories 1 to 5',

  inputConfig: {
    label: 'VITEEE Rank',
    placeholder: 'Enter your rank (e.g. 15000)',
    type: 'rank',
    min: 1,
    max: 1000000,
    step: 1,
    validationMessage: 'Please enter a valid VITEEE rank',
  },

  categories: ['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5'],
  states: [], // VITEEE is a national exam with no state-based quota
  genders: ['Male', 'Female'],

  programTypes: ['B.Tech'],
  steps: [
    { number: 1, label: 'Rank' },
    { number: 2, label: 'Category' },
    { number: 3, label: 'Recommendations' },
  ],

  sidebarFilters: {
    quotaTypes: [
      // VITEEE rank-based categories
      { label: 'Category 1', value: 'Category 1', defaultChecked: true },
      { label: 'Category 2', value: 'Category 2', defaultChecked: true },
      { label: 'Category 3', value: 'Category 3', defaultChecked: true },
      { label: 'Category 4', value: 'Category 4', defaultChecked: true },
      { label: 'Category 5', value: 'Category 5', defaultChecked: true },
      // Non-VITEEE admission routes
      { label: 'GATE (M.Tech)', value: 'GATE', defaultChecked: true },
      { label: 'CAT/MAT (MBA)', value: 'CAT/MAT', defaultChecked: true },
      { label: 'Direct Admission', value: 'Direct', defaultChecked: true },
      { label: 'Design Aptitude', value: 'Design Aptitude', defaultChecked: true },
      { label: 'NATA/JEE (B.Arch)', value: 'NATA/JEE', defaultChecked: true },
      { label: 'Research (Ph.D)', value: 'Research', defaultChecked: true },
    ],
    institutionTypes: [
      { label: 'VIT Vellore', value: 'VIT-V', defaultChecked: true },
      { label: 'VIT Chennai', value: 'VIT-C', defaultChecked: true },
      { label: 'VIT AP', value: 'VIT-AP', defaultChecked: true },
      { label: 'VIT Bhopal', value: 'VIT-B', defaultChecked: true },
    ],
    branchInterests: [
      { label: 'Computer Science (CSE)', value: 'Computer Science', defaultChecked: true },
      { label: 'CSE (AI & Machine Learning)', value: 'AI and ML', defaultChecked: true },
      { label: 'CSE (Cyber Security)', value: 'Cyber Security', defaultChecked: true },
      { label: 'CSE (Data Science)', value: 'Data Science', defaultChecked: true },
      { label: 'CSE (IoT)', value: 'Internet of Things', defaultChecked: true },
      { label: 'CSE (Software Engineering)', value: 'Software Engineering', defaultChecked: true },
      { label: 'Information Technology (IT)', value: 'Information Technology', defaultChecked: true },
      { label: 'ECE', value: 'Electronics and Communication', defaultChecked: true },
      { label: 'ECE (Robotics)', value: 'Robotics', defaultChecked: true },
      { label: 'Electrical & Electronics (EEE)', value: 'Electrical and Electronics', defaultChecked: true },
      { label: 'Mechanical', value: 'Mechanical', defaultChecked: true },
      { label: 'Civil', value: 'Civil', defaultChecked: true },
      { label: 'Chemical', value: 'Chemical', defaultChecked: true },
      { label: 'Biotechnology', value: 'Biotechnology', defaultChecked: true },
      { label: 'Design (B.Des)', value: 'Design', defaultChecked: true },
      { label: 'Management (BBA/MBA)', value: 'Management', defaultChecked: true },
      { label: 'Computer Applications (BCA/MCA)', value: 'Computer Applications', defaultChecked: true },
      { label: 'Architecture (B.Arch)', value: 'Architecture', defaultChecked: true },
    ],
    programTypes: [
      { label: 'B.Tech (VITEEE Based)', value: 'viteee', defaultChecked: true },
      { label: 'Non-VITEEE Programs', value: 'non-viteee', defaultChecked: true },
    ],
  },

  apiConfig: {
    predictEndpoint: '/predictor/viteee-predict',
    predictMethod: 'POST',
    buildRequestPayload: (input) => ({
      rank: input.value,
      category: input.category,
      gender: input.gender,
    }),
    parseResponse: parseVITEEEResponse,
    loadPredictionEndpoint: '/predictor/prediction',
  },

  sortOptions: [
    { label: 'Admission Chance', value: 'chance' },
    { label: 'Closing Rank', value: 'closingRank' },
    { label: 'NIRF Rank', value: 'nirfRank' },
  ],

  urlPath: '/predictors/viteee-predictor',
};
