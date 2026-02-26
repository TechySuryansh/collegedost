import type { PredictorConfig, FlatCollege, NormalizedPrediction, AdmissionChance } from '../types';

let _lastUserRank = 0;
let _lastUserCategory = 'Category 1';

export const viteeeConfig: PredictorConfig = {
  examName: 'VITEEE',
  examSlug: 'viteee',
  year: 2026,
  pageTitle: 'VITEEE College Predictor',
  pageSubtitle: 'Comprehensive Predictor for VIT Vellore, Chennai, AP (Amaravati) and Bhopal',

  inputConfig: {
    label: 'VITEEE Rank',
    placeholder: 'Enter Rank (e.g. 15000)',
    type: 'rank',
    min: 1,
    max: 200000,
    validationMessage: 'Please enter a valid VITEEE Rank (1 - 2,00,000)',
  },

  categories: ['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5'],
  states: [],
  genders: [],
  programTypes: [
    'B.Tech',
    'B.Des',
    'B.Arch',
    'BBA',
    'B.Sc',
    'BCA',
    'M.Tech',
    'Integrated M.Tech',
    'Integrated M.Sc',
    'MBA',
    'MCA',
    'Pharmacy',
    'Humanities'
  ],
  rankBasedPrograms: ['B.Tech'],

  steps: [
    { number: 1, label: 'Program & Rank' },
    { number: 2, label: 'Fee Category' },
    { number: 3, label: 'Campus Matching' }
  ],

  sidebarFilters: {
    quotaTypes: [
      { label: 'VIT Merit', value: 'Merit', defaultChecked: true }
    ],
    institutionTypes: [
      { label: 'VIT Vellore', value: 'VIT Vellore', defaultChecked: true },
      { label: 'VIT Chennai', value: 'VIT Chennai', defaultChecked: true },
      { label: 'VIT-AP (Amaravati)', value: 'VIT-AP', defaultChecked: true },
      { label: 'VIT Bhopal', value: 'VIT Bhopal', defaultChecked: true },
    ],
    branchInterests: [
      // VIT B.Tech Specializations
      { label: 'Computer Science (CSE)', value: 'Computer Science', defaultChecked: true },
      { label: 'CSE (AI & Machine Learning)', value: 'AI & Machine Learning', defaultChecked: true },
      { label: 'CSE (Cyber Security)', value: 'Cyber Security', defaultChecked: false },
      { label: 'CSE (Data Science)', value: 'Data Science', defaultChecked: false },
      { label: 'CSE (IoT)', value: 'IoT', defaultChecked: false },
      { label: 'CSE (Software Engineering)', value: 'Software Engineering', defaultChecked: false },
      { label: 'Information Technology (IT)', value: 'Information Technology', defaultChecked: false },
      { label: 'ECE', value: 'Electronics', defaultChecked: false },
      { label: 'ECE (Robotics)', value: 'Robotics', defaultChecked: false },
      { label: 'Electrical & Electronics (EEE)', value: 'Electrical', defaultChecked: false },
      { label: 'Mechanical', value: 'Mechanical', defaultChecked: false },
      { label: 'Civil', value: 'Civil', defaultChecked: false },
      { label: 'Chemical', value: 'Chemical', defaultChecked: false },
      { label: 'Biotechnology', value: 'Biotechnology', defaultChecked: false },
      // Other VIT Programs
      { label: 'Design (B.Des)', value: 'Design', defaultChecked: false },
      { label: 'Management (BBA/MBA)', value: 'Management', defaultChecked: false },
      { label: 'Computer Applications (BCA/MCA)', value: 'Applications', defaultChecked: false },
      { label: 'Architecture (B.Arch)', value: 'Architecture', defaultChecked: false },
    ],
    programTypes: [
      { label: 'B.Tech (VITEEE Based)', value: 'B.Tech', defaultChecked: true },
      { label: 'Non-VITEEE Programs', value: 'Non-BTech', defaultChecked: false },
    ],
  },

  apiConfig: {
    predictEndpoint: '/colleges/predict',
    predictMethod: 'GET',
    buildRequestPayload: (input) => {
      _lastUserRank = input.value;
      _lastUserCategory = input.category;
      return {
        rank: input.programType === 'B.Tech' ? input.value : 0,
        exam: 'VITEEE',
        category: input.category,
        programType: input.programType,
      };
    },

    parseResponse: (response: any): NormalizedPrediction => {
      const colleges: FlatCollege[] = (response.data || []).map((item: any) => {
        const matchingCutoff = item.matchingCutoffs?.[0];
        const cutoff = matchingCutoff?.closingRank || 0;
        const rank = _lastUserRank;

        let chance: AdmissionChance = 'not-eligible';
        const diff = rank - cutoff;

        // Requirement: VITEEE Logic for B.Tech
        if (rank <= cutoff) {
          chance = 'high';
        } else if (diff <= 2000) {
          chance = 'medium';
        } else if (diff <= 5000) {
          chance = 'low';
        } else {
          chance = 'not-eligible';
        }

        return {
          id: `${item._id}-${matchingCutoff?.branch || 'VITProgram'}-${_lastUserCategory}`,
          collegeName: item.name,
          institutionAbbrev: 'VIT',
          location: `${item.location?.city}, ${item.location?.state}`,
          course: matchingCutoff?.branch || 'Degree Program',
          quota: matchingCutoff?.category || _lastUserCategory,
          closingRank: cutoff,
          chance: chance,
          institutionType: 'Deemed University',
          programType: matchingCutoff?.programType || 'B.Tech'
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

  urlPath: '/predictors/viteee-predictor',
};
