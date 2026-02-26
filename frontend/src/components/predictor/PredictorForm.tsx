"use client";

import React from 'react';
import { FaStar } from 'react-icons/fa';
import type { PredictorFormProps } from './types';

export const PredictorForm: React.FC<PredictorFormProps> = ({
  config,
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
  loading,
  error,
  onSubmit,
}) => {
  const { steps, inputConfig, categories, states, genders, programTypes } = config;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-indigo-500/5">
      {/* Step Indicator */}
      <div className="flex items-center gap-8 mb-8 overflow-x-auto pb-4">
        {steps.map((step, i) => (
          <React.Fragment key={step.number}>
            {i > 0 && <div className="w-12 h-px bg-gray-200 shrink-0" />}
            <div className="flex items-center gap-3 min-w-max">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${i === 0
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-500'
                  }`}
              >
                {step.number}
              </div>
              <span
                className={`text-sm ${i === 0
                  ? 'font-bold text-slate-800'
                  : 'font-medium text-slate-500'
                  }`}
              >
                {step.label}
              </span>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Form Inputs */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Program Type */}
          {programTypes && programTypes.length > 0 && (
            <div className="space-y-2">
              <label htmlFor="program-type-select" className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
                Program Type
              </label>
              <select
                id="program-type-select"
                value={programType}
                onChange={(e) => setProgramType(e.target.value)}
                className="w-full h-14 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 px-5 text-lg font-medium transition-all outline-none appearance-none"
              >
                {programTypes.map((pt) => (
                  <option key={pt} value={pt}>
                    {pt}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Primary Input (Rank / Percentile / Score) */}
          {/* Logic: Hide if programType is selected and NOT in the rankBasedPrograms list (if defined) */}
          {(!programTypes || programTypes.length === 0 || !config.rankBasedPrograms || config.rankBasedPrograms.includes(programType)) && (
            <div className="space-y-2">
              <label htmlFor="predictor-input" className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
                {inputConfig.label}
              </label>
              <input
                id="predictor-input"
                type="number"
                min={inputConfig.min}
                max={inputConfig.max}
                step={inputConfig.step}
                placeholder={inputConfig.placeholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full h-14 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 px-5 text-lg font-medium transition-all outline-none"
              />
            </div>
          )}

          {/* Category */}
          {categories && categories.length > 0 && (
            <div className="space-y-2">
              <label htmlFor="category-select" className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
                {config.examSlug === 'viteee' ? 'VIT Category' : 'Category'}
              </label>
              <select
                id="category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-14 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 px-5 text-lg font-medium transition-all outline-none appearance-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Home State */}
          {states && states.length > 0 && (
            <div className="space-y-2">
              <label htmlFor="home-state-select" className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
                Home State
              </label>
              <select
                id="home-state-select"
                value={homeState}
                onChange={(e) => setHomeState(e.target.value)}
                className="w-full h-14 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 px-5 text-lg font-medium transition-all outline-none appearance-none"
              >
                <option value="">Select State</option>
                {states.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Gender */}
          {genders && genders.length > 0 && (
            <div className="space-y-2">
              <label htmlFor="gender-select" className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
                Gender
              </label>
              <select
                id="gender-select"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full h-14 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 px-5 text-lg font-medium transition-all outline-none appearance-none"
              >
                {genders.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 bg-rose-50 border border-rose-100 rounded-xl p-4 flex items-center gap-3 text-rose-700">
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-linear-to-r from-indigo-600 to-violet-600 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-600/25 hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-60 disabled:shadow-none disabled:translate-y-0"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Predict My Colleges{' '}
                <FaStar className="text-sm text-yellow-300" />
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
};
