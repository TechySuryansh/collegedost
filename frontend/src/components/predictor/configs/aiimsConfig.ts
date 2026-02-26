import type { PredictorConfig, FlatCollege, NormalizedPrediction, AdmissionChance } from '../types';

let _lastUserRank = 0;

export const aiimsConfig: PredictorConfig = {
  examName: 'AIIMS / INI-CET',
  examSlug: 'aiims-ini-cet',
  year: 2026,
  pageTitle: 'AIIMS & INI-CET College Predictor',
  pageSubtitle: 'Admission chances for AIIMS (UG) and INI-CET (PG) Institutes',

  inputConfig: {
    label: 'All India Rank',
    placeholder: 'Enter Rank (e.g. 500)',
    type: 'rank',
    min: 1,
    max: 1000000,
    validationMessage: 'Please enter a valid rank',
  },

  categories: ['General', 'OBC', 'SC', 'ST', 'EWS', 'PwD', 'PwBD'],
  states: [], // AIIMS/INI-CET does not use Home State quota
  genders: ['Male', 'Female'],
  programTypes: [
    'MBBS',
    'MD',
    'MS',
    'DM (6-year)',
    'DM (3-year)',
    'M.Ch (6-year)',
    'M.Ch (3-year)',
    'MDS',
    'B.Sc Nursing',
    'B.Sc Paramedical',
    'M.Sc Nursing',
    'MPH',
    'MHA',
    'PhD'
  ],
  rankBasedPrograms: ['MBBS', 'MD', 'MS', 'DM (6-year)', 'DM (3-year)', 'M.Ch (6-year)', 'M.Ch (3-year)', 'MDS'],

  steps: [
    { number: 1, label: 'Program & Rank' },
    { number: 2, label: 'Category & Preference' },
    { number: 3, label: 'Institute Matching' }
  ],

  sidebarFilters: {
    quotaTypes: [
      { label: 'All India (Open)', value: 'AI', defaultChecked: true },
      { label: 'Institute Internal', value: 'Internal', defaultChecked: false }
    ],
    institutionTypes: [
      { label: 'AIIMS New Delhi', value: 'AIIMS New Delhi', defaultChecked: true },
      { label: 'AIIMS Rishikesh', value: 'AIIMS Rishikesh', defaultChecked: true },
      { label: 'AIIMS Jodhpur', value: 'AIIMS Jodhpur', defaultChecked: true },
      { label: 'AIIMS Bhopal', value: 'AIIMS Bhopal', defaultChecked: true },
      { label: 'AIIMS Bhubaneswar', value: 'AIIMS Bhubaneswar', defaultChecked: true },
      { label: 'AIIMS Patna', value: 'AIIMS Patna', defaultChecked: true },
      { label: 'AIIMS Raipur', value: 'AIIMS Raipur', defaultChecked: true },
      { label: 'PGI Chandigarh', value: 'PGIMER', defaultChecked: true },
      { label: 'JIPMER Puducherry', value: 'JIPMER', defaultChecked: true },
      { label: 'NIMHANS Bengaluru', value: 'NIMHANS', defaultChecked: true },
      { label: 'SCTIMST Trivandrum', value: 'SCTIMST', defaultChecked: true },
    ],
    branchInterests: [
      // MBBS
      { label: 'MBBS (Single Branch)', value: 'MBBS', defaultChecked: true },
      // MD Branches
      { label: 'MD Anaesthesiology', value: 'Anaesthesiology', defaultChecked: false },
      { label: 'MD Anatomy', value: 'Anatomy', defaultChecked: false },
      { label: 'MD Biochemistry', value: 'Biochemistry', defaultChecked: false },
      { label: 'MD Community Medicine', value: 'Community Medicine', defaultChecked: false },
      { label: 'MD Dermatology', value: 'Dermatology', defaultChecked: false },
      { label: 'MD Emergency Medicine', value: 'Emergency Medicine', defaultChecked: false },
      { label: 'MD General Medicine', value: 'General Medicine', defaultChecked: false },
      { label: 'MD Obstetrics & Gynaecology', value: 'Obstetrics', defaultChecked: false },
      { label: 'MD Paediatrics', value: 'Paediatrics', defaultChecked: false },
      { label: 'MD Radiodiagnosis', value: 'Radiodiagnosis', defaultChecked: false },
      // MS Branches
      { label: 'MS ENT', value: 'ENT', defaultChecked: false },
      { label: 'MS General Surgery', value: 'General Surgery', defaultChecked: false },
      { label: 'MS Ophthalmology', value: 'Ophthalmology', defaultChecked: false },
      { label: 'MS Orthopaedics', value: 'Orthopaedics', defaultChecked: false },
      // MDS
      { label: 'Conservative Dentistry', value: 'Conservative', defaultChecked: false },
      { label: 'Oral Surgery', value: 'Oral Surgery', defaultChecked: false },
      { label: 'Orthodontics', value: 'Orthodontics', defaultChecked: false },
      // DM & M.Ch (6-yr)
      { label: 'Cardiology', value: 'Cardiology', defaultChecked: false },
      { label: 'Neurology', value: 'Neurology', defaultChecked: false },
      { label: 'Gastroenterology', value: 'Gastroenterology', defaultChecked: false },
      { label: 'Neurosurgery (M.Ch)', value: 'Neurosurgery', defaultChecked: false },
      { label: 'Urology (M.Ch)', value: 'Urology', defaultChecked: false },
    ],
    programTypes: [
      { label: 'UG (AIIMS)', value: 'UG', defaultChecked: true },
      { label: 'PG (INI-CET)', value: 'PG', defaultChecked: false },
      { label: 'Super-Specialty', value: 'SS', defaultChecked: false },
    ],
  },

  apiConfig: {
    predictEndpoint: '/colleges/predict',
    predictMethod: 'GET',
    buildRequestPayload: (input) => {
      _lastUserRank = input.value;
      const isRankMode = aiimsConfig.rankBasedPrograms?.includes(input.programType);
      return {
        rank: isRankMode ? input.value : 0,
        exam: input.programType === 'MBBS' ? 'AIIMS' : 'INI-CET',
        category: input.category,
        programType: input.programType,
        gender: input.gender,
      };
    },

    parseResponse: (response: any): NormalizedPrediction => {
      const colleges: FlatCollege[] = (response.data || []).map((item: any) => {
        const matchingCutoff = item.matchingCutoffs?.[0];
        const cutoff = matchingCutoff?.closingRank || 0;
        const rank = _lastUserRank;

        let chance: AdmissionChance = 'not-eligible';

        // Medical Rank Logic
        if (rank <= cutoff) {
          chance = 'high';
        } else if (rank <= cutoff * 1.1) {
          chance = 'medium';
        } else if (rank <= cutoff * 1.2) {
          chance = 'low';
        } else {
          chance = 'not-eligible';
        }

        return {
          id: `${item._id}-${matchingCutoff?.branch || 'Medicine'}`,
          collegeName: item.name,
          institutionAbbrev: item.name.includes('AIIMS') ? 'AIIMS' : 'INI',
          location: `${item.location?.city}, ${item.location?.state}`,
          course: matchingCutoff?.branch || 'Medical Program',
          quota: matchingCutoff?.category || 'General',
          closingRank: cutoff,
          chance: chance,
          institutionType: 'Government Medical Institute',
          programType: matchingCutoff?.programType || 'MBBS'
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

  urlPath: '/predictors/aiims-predictor',
};
