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
  states: [],
  genders: ['Male', 'Female'],
  programTypes: [
    'MBBS', 'MD', 'MS', 'DM (6-year)', 'DM (3-year)',
    'M.Ch (6-year)', 'M.Ch (3-year)', 'MDS',
    'B.Sc Nursing', 'B.Sc Paramedical', 'M.Sc Nursing', 'MPH', 'MHA', 'PhD'
  ],
  rankBasedPrograms: ['MBBS', 'MD', 'MS', 'DM (6-year)', 'DM (3-year)', 'M.Ch (6-year)', 'M.Ch (3-year)', 'MDS'],

  steps: [
    { number: 1, label: 'Program & Rank' },
    { number: 2, label: 'Category & Preference' },
  ],

  sidebarFilters: {
    quotaTypes: [
      { label: 'All India (Open)', value: 'AI', defaultChecked: true },
      { label: 'Institute Internal', value: 'Internal', defaultChecked: true },
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
      { label: 'MBBS (Single Branch)', value: 'MBBS', defaultChecked: true },
      { label: 'MD Anaesthesiology', value: 'Anaesthesiology', defaultChecked: true },
      { label: 'MD Anatomy', value: 'Anatomy', defaultChecked: true },
      { label: 'MD Biochemistry', value: 'Biochemistry', defaultChecked: true },
      { label: 'MD Community Medicine', value: 'Community Medicine', defaultChecked: true },
      { label: 'MD Dermatology', value: 'Dermatology', defaultChecked: true },
      { label: 'MD Emergency Medicine', value: 'Emergency Medicine', defaultChecked: true },
      { label: 'MD General Medicine', value: 'General Medicine', defaultChecked: true },
      { label: 'MD Obstetrics & Gynaecology', value: 'Obstetrics', defaultChecked: true },
      { label: 'MD Paediatrics', value: 'Paediatrics', defaultChecked: true },
      { label: 'MD Radiodiagnosis', value: 'Radiodiagnosis', defaultChecked: true },
      { label: 'MS ENT', value: 'ENT', defaultChecked: true },
      { label: 'MS General Surgery', value: 'General Surgery', defaultChecked: true },
      { label: 'MS Ophthalmology', value: 'Ophthalmology', defaultChecked: true },
      { label: 'MS Orthopaedics', value: 'Orthopaedics', defaultChecked: true },
      { label: 'Conservative Dentistry', value: 'Conservative', defaultChecked: true },
      { label: 'Oral Surgery', value: 'Oral Surgery', defaultChecked: true },
      { label: 'Orthodontics', value: 'Orthodontics', defaultChecked: true },
      { label: 'Cardiology', value: 'Cardiology', defaultChecked: true },
      { label: 'Neurology', value: 'Neurology', defaultChecked: true },
      { label: 'Gastroenterology', value: 'Gastroenterology', defaultChecked: true },
      { label: 'Neurosurgery (M.Ch)', value: 'Neurosurgery', defaultChecked: true },
      { label: 'Urology (M.Ch)', value: 'Urology', defaultChecked: true },
    ],
    programTypes: [
      { label: 'UG (AIIMS)', value: 'UG', defaultChecked: true },
      { label: 'PG (INI-CET)', value: 'PG', defaultChecked: true },
      { label: 'Super-Specialty', value: 'SS', defaultChecked: true },
    ],
  },

  apiConfig: {
    predictEndpoint: '/colleges/predict',
    predictMethod: 'GET',
    buildRequestPayload: (input) => {
      _lastUserRank = input.value;
      return {
        rank: input.value,
        exam: input.programType === 'MBBS' ? 'AIIMS' : 'INI-CET',
        category: input.category,
        gender: input.gender,
      };
    },

    parseResponse: (response: any): NormalizedPrediction => {
      const colleges: FlatCollege[] = [];
      const rank = _lastUserRank;

      for (const item of response.data || []) {
        const instName = item.name || '';
        const slug = instName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const locationStr = `${item.location?.city || ''}, ${item.location?.state || ''}`;

        let abbrev = 'INI';
        let derivedInstType = 'AIIMS New Delhi'; // default fallback

        if (instName.includes('AIIMS')) {
          abbrev = 'AIIMS';
          // Match specific AIIMS for institution type filter
          if (instName.includes('New Delhi') || instName.includes('Delhi')) derivedInstType = 'AIIMS New Delhi';
          else if (instName.includes('Rishikesh')) derivedInstType = 'AIIMS Rishikesh';
          else if (instName.includes('Jodhpur')) derivedInstType = 'AIIMS Jodhpur';
          else if (instName.includes('Bhopal')) derivedInstType = 'AIIMS Bhopal';
          else if (instName.includes('Bhubaneswar')) derivedInstType = 'AIIMS Bhubaneswar';
          else if (instName.includes('Patna')) derivedInstType = 'AIIMS Patna';
          else if (instName.includes('Raipur')) derivedInstType = 'AIIMS Raipur';
          else derivedInstType = 'AIIMS New Delhi'; // other AIIMS
        } else if (instName.includes('PGIMER') || instName.includes('PGI')) {
          abbrev = 'PGI'; derivedInstType = 'PGIMER';
        } else if (instName.includes('JIPMER')) {
          abbrev = 'JIPMER'; derivedInstType = 'JIPMER';
        } else if (instName.includes('NIMHANS')) {
          abbrev = 'NIMH'; derivedInstType = 'NIMHANS';
        } else if (instName.includes('SCTIMST')) {
          abbrev = 'SCTI'; derivedInstType = 'SCTIMST';
        }

        for (const cut of item.matchingCutoffs || []) {
          const cutoff = cut.closing || cut.closingRank || 0;

          let chance: AdmissionChance = 'not-eligible';
          if (rank <= cutoff) chance = 'high';
          else if (rank <= cutoff * 1.1) chance = 'medium';
          else if (rank <= cutoff * 1.2) chance = 'low';

          colleges.push({
            id: `${item._id}-${cut.branch}-${cut.quota}-${cutoff}`,
            collegeName: instName,
            collegeSlug: slug,
            institutionAbbrev: abbrev,
            location: locationStr,
            course: cut.branch || 'Medical Program',
            quota: cut.quota || 'AI',
            closingRank: cutoff,
            cutoffLabel: 'Closing Rank',
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
    { label: 'Closing Rank (Low to High)', value: 'closingRank' },
  ],

  urlPath: '/predictors/aiims-predictor',
};
