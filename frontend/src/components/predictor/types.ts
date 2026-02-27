import { ReactNode } from 'react';

// ═══════════════════════════════════════════
// PREDICTOR CONFIG TYPES
// ═══════════════════════════════════════════

/** Configuration for the primary input field (rank/percentile/score) */
export interface InputConfig {
  label: string;
  placeholder: string;
  type: 'rank' | 'percentile' | 'score';
  min: number;
  max: number;
  step?: number;
  validationMessage: string;
}

/** A single filter option in the sidebar */
export interface FilterOption {
  label: string;
  value: string;
  defaultChecked: boolean;
}

/** Sidebar filter configuration for an exam */
export interface SidebarFilterConfig {
  quotaTypes: FilterOption[];
  institutionTypes: FilterOption[];
  branchInterests: FilterOption[];
  programTypes: FilterOption[];
}

/** Step indicator configuration */
export interface StepConfig {
  number: number;
  label: string;
}

/** Sort option for results */
export interface SortOptionConfig {
  label: string;
  value: SortOption;
}

/** Full configuration object for a predictor exam */
export interface PredictorConfig {
  examName: string;
  examSlug: string;
  year: number;
  pageTitle: string;
  pageSubtitle: string;

  inputConfig: InputConfig;
  categories: string[];
  states: string[];
  genders: string[];
  programTypes: string[];
  rankBasedPrograms?: string[];

  steps: StepConfig[];
  sidebarFilters: SidebarFilterConfig;

  apiConfig: {
    predictEndpoint: string;
    predictMethod: 'POST' | 'GET';
    buildRequestPayload: (input: PredictorFormInput) => Record<string, unknown>;
    parseResponse: (data: Record<string, unknown>) => NormalizedPrediction;
    loadPredictionEndpoint?: string;
  };

  sortOptions: SortOptionConfig[];
  urlPath: string;
  comingSoon?: boolean;
}

// ═══════════════════════════════════════════
// FORM INPUT TYPES
// ═══════════════════════════════════════════

export interface PredictorFormInput {
  value: number;
  category: string;
  homeState: string;
  gender: string;
  programType: string;
}

// ═══════════════════════════════════════════
// RESULT / PREDICTION TYPES
// ═══════════════════════════════════════════

export type AdmissionChance = 'high' | 'medium' | 'low' | 'not-eligible';

export interface FlatCollege {
  id: string;
  collegeName: string;
  collegeSlug?: string;
  location: string;
  nirfRank?: number;
  course: string;
  quota: string;
  closingRank: number;
  cutoffLabel?: string;
  chance: AdmissionChance;
  institutionType: string;
  institutionAbbrev: string;
}

export interface PredictionSummary {
  high: number;
  medium: number;
  low: number;
  'not-eligible': number;
}

export interface NormalizedPrediction {
  success: boolean;
  predictionId?: string;
  totalResults: number;
  colleges: FlatCollege[];
  summary: PredictionSummary;
  estimatedRank?: number;
  additionalInfo?: Record<string, unknown>;
}

// ═══════════════════════════════════════════
// FILTER & SORT TYPES
// ═══════════════════════════════════════════

export interface FilterState {
  quotaTypes: string[];
  institutionTypes: string[];
  branchInterests: string[];
  programTypes: string[];
}

export type SortOption = 'closingRank' | 'chance' | 'nirfRank';

// ═══════════════════════════════════════════
// COMPONENT PROP TYPES
// ═══════════════════════════════════════════

export interface PredictorBaseProps {
  config: PredictorConfig;
}

export interface PredictorHeaderProps {
  title: string;
  subtitle: string;
  icon: ReactNode;
}

export interface PredictorFormProps {
  config: PredictorConfig;
  inputValue: string;
  setInputValue: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  homeState: string;
  setHomeState: (v: string) => void;
  gender: string;
  setGender: (v: string) => void;
  programType: string;
  setProgramType: (v: string) => void;
  loading: boolean;
  error: string;
  onSubmit: () => void;
}

export interface PredictorSidebarProps {
  config: PredictorConfig;
  activeFilters: FilterState;
  onFilterChange: (group: keyof FilterState, value: string) => void;
  onReset: () => void;
}

export interface CollegeResultCardProps {
  college: FlatCollege;
  onViewDetails?: () => void;
}

export interface PredictorResultsProps {
  colleges: FlatCollege[];
  totalResults: number;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  sortOptions: SortOptionConfig[];
  hasMore: boolean;
  onLoadMore: () => void;
  loading: boolean;
}
