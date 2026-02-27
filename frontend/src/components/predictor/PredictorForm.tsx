"use client";

import React, { useState } from 'react';
import { FaStar, FaArrowRight, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
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
  const [currentStep, setCurrentStep] = useState(0);
  const [stepError, setStepError] = useState('');

  const handleNext = () => {
    setStepError('');
    // Validate Step 1 input
    const numValue = parseFloat(inputValue);
    // Only validate rank input if it's visible (rankBasedPrograms check)
    const showInput = !programTypes || programTypes.length === 0 || !config.rankBasedPrograms || config.rankBasedPrograms.includes(programType);
    if (showInput) {
      if (!inputValue || isNaN(numValue) || numValue < inputConfig.min || numValue > inputConfig.max) {
        setStepError(inputConfig.validationMessage);
        return;
      }
    }
    setCurrentStep(1);
  };

  const handleBack = () => {
    setStepError('');
    setCurrentStep(0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStepError('');
    if (states.length > 0 && !homeState) {
      setStepError('Please select your Home State');
      return;
    }
    onSubmit();
  };

  const showRankInput = !programTypes || programTypes.length === 0 || !config.rankBasedPrograms || config.rankBasedPrograms.includes(programType);

  return (
    <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-indigo-500/5">
      {/* Step Progress Bar */}
      <div className="flex items-center justify-center gap-0 mb-10">
        {steps.map((step, i) => (
          <React.Fragment key={step.number}>
            {/* Step Circle + Label */}
            <div className="flex items-center gap-2.5">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${i < currentStep
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                    : i === currentStep
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-110'
                      : 'bg-gray-100 text-gray-400'
                  }`}
              >
                {i < currentStep ? (
                  <FaCheckCircle className="text-sm" />
                ) : (
                  step.number
                )}
              </div>
              <span
                className={`text-sm hidden sm:inline transition-all duration-300 ${i === currentStep
                    ? 'font-bold text-slate-800'
                    : i < currentStep
                      ? 'font-medium text-emerald-600'
                      : 'font-medium text-slate-400'
                  }`}
              >
                {step.label}
              </span>
            </div>
            {/* Connector line */}
            {i < steps.length - 1 && (
              <div className="flex-1 mx-3 sm:mx-5 max-w-[80px]">
                <div
                  className={`h-[3px] rounded-full transition-all duration-500 ${i < currentStep ? 'bg-emerald-500' : 'bg-gray-200'
                    }`}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* ─── STEP 1: Exam Details ──────────────────────────────── */}
        <div
          className={`transition-all duration-400 ${currentStep === 0
              ? 'opacity-100 max-h-[600px]'
              : 'opacity-0 max-h-0 overflow-hidden pointer-events-none'
            }`}
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
              Enter Your {inputConfig.type === 'rank' ? 'Rank' : inputConfig.type === 'percentile' ? 'Percentile' : 'Score'}
            </h2>
            <p className="text-slate-500 mt-1">
              Fill in your exam details to get started
            </p>
          </div>

          <div className="max-w-lg mx-auto space-y-6">
            {/* Program Type (if applicable) */}
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
            {showRankInput && (
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
                  autoFocus
                />
              </div>
            )}
          </div>

          {/* Step 1 Error */}
          {stepError && currentStep === 0 && (
            <div className="mt-4 max-w-lg mx-auto bg-rose-50 border border-rose-100 rounded-xl p-4 flex items-center gap-3 text-rose-700">
              <span className="text-sm font-medium">{stepError}</span>
            </div>
          )}

          {/* Next Button */}
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={handleNext}
              className="bg-linear-to-r from-indigo-600 to-violet-600 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-600/25 hover:-translate-y-0.5 transition-all flex items-center gap-3"
            >
              Next <FaArrowRight className="text-sm" />
            </button>
          </div>
        </div>

        {/* ─── STEP 2: Personal Details ──────────────────────────── */}
        <div
          className={`transition-all duration-400 ${currentStep === 1
              ? 'opacity-100 max-h-[800px]'
              : 'opacity-0 max-h-0 overflow-hidden pointer-events-none'
            }`}
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
              Your Details
            </h2>
            <p className="text-slate-500 mt-1">
              Help us personalize your college predictions
            </p>
          </div>

          <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
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

            {/* Gender */}
            {genders && genders.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
                  Gender
                </label>
                <div className="flex gap-3 h-14 items-center">
                  {genders.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`flex-1 h-full rounded-2xl font-semibold text-base transition-all border-2 ${gender === g
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md shadow-indigo-500/10'
                          : 'border-gray-200 bg-gray-50 text-slate-500 hover:border-gray-300'
                        }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Home State */}
            {states && states.length > 0 && (
              <div className="space-y-2 sm:col-span-2">
                <label htmlFor="home-state-select" className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
                  Domicile State
                </label>
                <select
                  id="home-state-select"
                  value={homeState}
                  onChange={(e) => setHomeState(e.target.value)}
                  className="w-full h-14 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 px-5 text-lg font-medium transition-all outline-none appearance-none"
                >
                  <option value="">Select Domicile State</option>
                  {states.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Step 2 Errors */}
          {(stepError || error) && currentStep === 1 && (
            <div className="mt-4 max-w-2xl mx-auto bg-rose-50 border border-rose-100 rounded-xl p-4 flex items-center gap-3 text-rose-700">
              <span className="text-sm font-medium">{stepError || error}</span>
            </div>
          )}

          {/* Back + Predict Buttons */}
          <div className="mt-8 flex justify-center gap-4">
            <button
              type="button"
              onClick={handleBack}
              className="px-8 py-4 rounded-2xl font-bold text-base border-2 border-gray-200 text-slate-600 hover:bg-gray-50 transition-all flex items-center gap-2"
            >
              <FaArrowLeft className="text-sm" /> Back
            </button>
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
        </div>
      </form>
    </section>
  );
};
