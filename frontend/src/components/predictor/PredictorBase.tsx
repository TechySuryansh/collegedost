"use client";

import React from 'react';
import { FaTools, FaStethoscope, FaUniversity } from 'react-icons/fa';
import { usePredictor } from './hooks/usePredictor';
import { PredictorHeader } from './PredictorHeader';
import { PredictorSidebar } from './PredictorSidebar';
import { PredictorForm } from './PredictorForm';
import { PredictorResults } from './PredictorResults';
import { useAuth } from '../../context/AuthContext';
import AuthModal from '../AuthModal';
import type { PredictorBaseProps } from './types';

/** Map exam slugs to header icons */
function getExamIcon(slug: string): React.ReactNode {
  switch (slug) {
    case 'jee-main':
      return <FaTools className="text-3xl" />;
    case 'neet-ug':
      return <FaStethoscope className="text-3xl" />;
    case 'cuet-ug':
      return <FaUniversity className="text-3xl" />;
    default:
      return <FaUniversity className="text-3xl" />;
  }
}

export const PredictorBase: React.FC<PredictorBaseProps> = ({ config }) => {
  const predictor = usePredictor(config);
  const { user, isAuthModalOpen, openAuthModal, closeAuthModal } = useAuth();

  const hasResults = predictor.prediction && predictor.prediction.totalResults > 0;
  const showResultsArea = predictor.loading || hasResults;

  // Gate prediction behind login: if user is not logged in, show AuthModal instead of predicting
  const handlePredictWithAuth = () => {
    if (!user) {
      openAuthModal();
      return;
    }
    predictor.handlePredict();
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} initialTab="signup" />

      {/* Header */}
      <PredictorHeader
        title={config.pageTitle}
        subtitle={config.pageSubtitle}
        icon={getExamIcon(config.examSlug)}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Form — Full width centered when no results; in grid when results exist */}
        {!showResultsArea ? (
          <div className="max-w-3xl mx-auto">
            <PredictorForm
              config={config}
              inputValue={predictor.inputValue}
              setInputValue={predictor.setInputValue}
              category={predictor.category}
              setCategory={predictor.setCategory}
              homeState={predictor.homeState}
              setHomeState={predictor.setHomeState}
              gender={predictor.gender}
              setGender={predictor.setGender}
              programType={predictor.programType}
              setProgramType={predictor.setProgramType}
              loading={predictor.loading}
              error={predictor.error}
              onSubmit={handlePredictWithAuth}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar */}
            <PredictorSidebar
              config={config}
              activeFilters={predictor.activeFilters}
              onFilterChange={predictor.toggleFilter}
              onReset={predictor.resetFilters}
            />

            {/* Main Column */}
            <div className="lg:col-span-9 space-y-8">

              {/* Results */}
              {(predictor.loading || (predictor.prediction && predictor.prediction.totalResults > 0)) && (
                <PredictorResults
                  colleges={predictor.colleges}
                  totalResults={predictor.totalResults}
                  sortBy={predictor.sortBy}
                  onSortChange={predictor.setSortBy}
                  sortOptions={config.sortOptions}
                  hasMore={predictor.hasMore}
                  onLoadMore={predictor.loadMore}
                  loading={predictor.loading}
                />
              )}

              {/* Empty state after prediction with 0 results */}
              {predictor.prediction &&
                !predictor.loading &&
                predictor.prediction.totalResults === 0 && (
                  <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaUniversity className="text-2xl text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">
                      No colleges found
                    </h3>
                    <p className="text-slate-500 max-w-md mx-auto">
                      We couldn&apos;t find matching colleges for your{' '}
                      {config.examName} input. Try adjusting your rank, category,
                      or filters.
                    </p>
                  </div>
                )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
