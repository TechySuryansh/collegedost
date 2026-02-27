"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/api/axios';
import type {
  PredictorConfig,
  FlatCollege,
  FilterState,
  SortOption,
  NormalizedPrediction,
} from '../types';

const PAGE_SIZE = 10;

function buildDefaultFilters(config: PredictorConfig): FilterState {
  return {
    quotaTypes: config.sidebarFilters.quotaTypes
      .filter((f) => f.defaultChecked)
      .map((f) => f.value),
    institutionTypes: config.sidebarFilters.institutionTypes
      .filter((f) => f.defaultChecked)
      .map((f) => f.value),
    branchInterests: config.sidebarFilters.branchInterests
      .filter((f) => f.defaultChecked)
      .map((f) => f.value),
    programTypes: config.sidebarFilters.programTypes
      .filter((f) => f.defaultChecked)
      .map((f) => f.value),
  };
}

export function usePredictor(config: PredictorConfig) {
  const searchParams = useSearchParams();

  // ─── Form State ───
  const [inputValue, setInputValue] = useState('');
  const [category, setCategory] = useState(config.categories[0]);
  const [homeState, setHomeState] = useState('');
  const [gender, setGender] = useState(config.genders[0] || '');
  const [programType, setProgramType] = useState(config.programTypes[0] || '');

  // ─── Results State ───
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [prediction, setPrediction] = useState<NormalizedPrediction | null>(null);
  const [allColleges, setAllColleges] = useState<FlatCollege[]>([]);

  // ─── Filter / Sort / Pagination ───
  const [activeFilters, setActiveFilters] = useState<FilterState>(() =>
    buildDefaultFilters(config)
  );
  const [sortBy, setSortBy] = useState<SortOption>(
    config.sortOptions[0]?.value ?? 'closingRank'
  );
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);

  // ─── Load prediction from URL ───
  useEffect(() => {
    const id = searchParams?.get('id');
    if (id && config.apiConfig.loadPredictionEndpoint) {
      loadPredictionById(id);
    }

  }, [searchParams]);

  const loadPredictionById = async (id: string) => {
    if (!config.apiConfig.loadPredictionEndpoint) return;
    try {
      setLoading(true);
      setError('');
      const response = await api.get(`${config.apiConfig.loadPredictionEndpoint}/${id}`);
      if (response.data?.success) {
        const normalized = config.apiConfig.parseResponse(response.data);
        setPrediction(normalized);
        setAllColleges(normalized.colleges);
      }
    } catch {
      setError('Failed to load saved prediction.');
    } finally {
      setLoading(false);
    }
  };

  // ─── Predict ───
  const handlePredict = useCallback(async () => {
    const numValue = parseFloat(inputValue);

    if (
      !inputValue ||
      isNaN(numValue) ||
      numValue < config.inputConfig.min ||
      numValue > config.inputConfig.max
    ) {
      setError(config.inputConfig.validationMessage);
      return;
    }
    // Only require homeState if the config actually uses states
    if (config.states.length > 0 && !homeState) {
      setError('Please select your Home State');
      return;
    }

    setLoading(true);
    setError('');
    setPrediction(null);
    setAllColleges([]);
    setDisplayCount(PAGE_SIZE);

    try {
      const payload = config.apiConfig.buildRequestPayload({
        value: numValue,
        category,
        homeState,
        gender,
        programType,
      });

      let response;
      if (config.apiConfig.predictMethod === 'GET') {
        const params = new URLSearchParams(
          Object.entries(payload).reduce<Record<string, string>>((acc, [k, v]) => {
            acc[k] = String(v);
            return acc;
          }, {})
        );
        response = await api.get(`${config.apiConfig.predictEndpoint}?${params.toString()}`);
      } else {
        response = await api.post(config.apiConfig.predictEndpoint, payload);
      }

      if (response.data) {
        const normalized = config.apiConfig.parseResponse(response.data);
        setPrediction(normalized);
        setAllColleges(normalized.colleges);

        if (normalized.predictionId) {
          window.history.replaceState(
            {},
            '',
            `${config.urlPath}?id=${normalized.predictionId}`
          );
        }

        setTimeout(() => {
          document.getElementById('predictor-results')?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number } };
      if (axiosErr.response?.status === 503) {
        setError(`${config.examName} College Predictor is currently disabled. Please try again later.`);
      } else {
        setError('Failed to fetch predictions. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  }, [inputValue, category, homeState, gender, config]);

  // ─── Filtering & Sorting ───
  const filteredColleges = useMemo(() => {
    let filtered = [...allColleges];

    // Helper: check if all options in a filter group are selected (= show everything)
    const allChecked = (filterKey: 'quotaTypes' | 'institutionTypes' | 'branchInterests' | 'programTypes') => {
      const allValues = (config.sidebarFilters[filterKey] ?? []).map(f => f.value);
      if (allValues.length === 0) return true;
      return allValues.every(v => activeFilters[filterKey].includes(v));
    };

    // Quota filter — skip when all checked; use exact match to avoid 'HU' matching 'OHU'
    if (!allChecked('quotaTypes') && activeFilters.quotaTypes.length > 0) {
      filtered = filtered.filter((c) =>
        activeFilters.quotaTypes.some((qt) =>
          c.quota.toLowerCase() === qt.toLowerCase()
        )
      );
    }

    // Institution type filter — skip when all checked
    if (!allChecked('institutionTypes') && activeFilters.institutionTypes.length > 0) {
      filtered = filtered.filter((c) =>
        activeFilters.institutionTypes.some((it) => {
          const instLower = c.institutionType.toLowerCase();
          const abbrevLower = c.institutionAbbrev.toLowerCase();
          const itLower = it.toLowerCase();
          return instLower.includes(itLower) || abbrevLower.includes(itLower);
        })
      );
    }

    // Branch filter — skip when all checked
    if (!allChecked('branchInterests') && activeFilters.branchInterests.length > 0) {
      filtered = filtered.filter((c) =>
        activeFilters.branchInterests.some((bi) =>
          c.course.toLowerCase().includes(bi.toLowerCase())
        )
      );
    }

    // Program type filter — skip when all checked
    if (!allChecked('programTypes') && activeFilters.programTypes && activeFilters.programTypes.length > 0) {
      const hasViteeeFilter = activeFilters.programTypes.includes('viteee');
      const hasNonViteeeFilter = activeFilters.programTypes.includes('non-viteee');

      if (hasViteeeFilter || hasNonViteeeFilter) {
        // VITEEE style: filter by quota presence (category 1-5 = VITEEE, others = non-VITEEE)
        filtered = filtered.filter((c) => {
          const isViteee = c.quota.toLowerCase().startsWith('category');
          if (hasViteeeFilter && hasNonViteeeFilter) return true; // both → show all
          return hasViteeeFilter ? isViteee : !isViteee;
        });
      } else {
        // Course-name matching: works for BITSAT (B.E./B.Pharm/M.Sc. prefixes),
        // Dual Degree, B.Arch, Integrated M.Tech (identifiable in course name)
        filtered = filtered.filter((c) =>
          activeFilters.programTypes.some((pt) =>
            c.course.toLowerCase().includes(pt.toLowerCase())
          )
        );
      }
    }

    // Sort
    const sorted = [...filtered];
    switch (sortBy) {
      case 'closingRank':
        sorted.sort((a, b) => (a.closingRank || 0) - (b.closingRank || 0));
        break;
      case 'chance': {
        const order: Record<string, number> = { high: 1, medium: 2, low: 3 };
        sorted.sort((a, b) => {
          const aVal = order[a.chance] ?? 4;
          const bVal = order[b.chance] ?? 4;
          return aVal - bVal;
        });
        break;
      }
      case 'nirfRank':
        sorted.sort((a, b) => (a.nirfRank || 9999) - (b.nirfRank || 9999));
        break;
    }

    return sorted;
  }, [allColleges, activeFilters, sortBy]);

  const displayedColleges = useMemo(
    () => filteredColleges.slice(0, displayCount),
    [filteredColleges, displayCount]
  );

  const hasMore = displayCount < filteredColleges.length;

  const loadMore = useCallback(() => {
    setDisplayCount((prev) => prev + PAGE_SIZE);
  }, []);

  const toggleFilter = useCallback(
    (group: keyof FilterState, value: string) => {
      setActiveFilters((prev) => {
        const current = prev[group];
        const updated = current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value];
        return { ...prev, [group]: updated };
      });
      setDisplayCount(PAGE_SIZE);
    },
    []
  );

  const resetFilters = useCallback(() => {
    // Reset to all options checked
    setActiveFilters({
      quotaTypes: config.sidebarFilters.quotaTypes.map((f) => f.value),
      institutionTypes: config.sidebarFilters.institutionTypes.map((f) => f.value),
      branchInterests: config.sidebarFilters.branchInterests.map((f) => f.value),
      programTypes: config.sidebarFilters.programTypes.map((f) => f.value),
    });
    setDisplayCount(PAGE_SIZE);
  }, [config]);

  return {
    // Form state
    inputValue,
    setInputValue,
    category,
    setCategory,
    homeState,
    setHomeState,
    gender,
    setGender,
    programType,
    setProgramType,

    // Loading / errors
    loading,
    error,

    // Prediction data
    prediction,
    colleges: displayedColleges,
    totalResults: filteredColleges.length,
    hasMore,

    // Filter / Sort
    activeFilters,
    toggleFilter,
    resetFilters,
    sortBy,
    setSortBy,

    // Actions
    handlePredict,
    loadMore,
  };
}
