"use client";

import React from 'react';
import { FaSlidersH } from 'react-icons/fa';
import type { PredictorSidebarProps, FilterState } from './types';

export const PredictorSidebar: React.FC<PredictorSidebarProps> = ({
  config,
  activeFilters,
  onFilterChange,
  onReset,
}) => {
  const { sidebarFilters } = config;

  const renderGroup = (
    label: string,
    groupKey: keyof FilterState,
    options: typeof sidebarFilters.quotaTypes
  ) => (
    <div>
      <label className="block text-sm font-semibold text-slate-800 mb-3 uppercase tracking-wider">
        {label}
      </label>
      <div className="space-y-2.5">
        {options.map((opt) => (
          <label
            key={opt.value}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <input
              type="checkbox"
              checked={activeFilters[groupKey].includes(opt.value)}
              onChange={() => onFilterChange(groupKey, opt.value)}
              className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 transition-all"
            />
            <span className="text-sm text-slate-500 group-hover:text-slate-800">
              {opt.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <aside className="lg:col-span-3 space-y-6">
      {/* Filters Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800">
            <FaSlidersH className="text-slate-600" /> Filters
          </h3>
          <button
            onClick={onReset}
            className="text-xs text-indigo-600 font-semibold hover:underline"
          >
            Reset All
          </button>
        </div>
        <div className="p-5 space-y-8">
          {renderGroup('Quota Type', 'quotaTypes', sidebarFilters.quotaTypes)}
          {renderGroup(
            'Institution Type',
            'institutionTypes',
            sidebarFilters.institutionTypes
          )}
          {sidebarFilters.branchInterests.length > 0 && renderGroup(
            'Branch Interest',
            'branchInterests',
            sidebarFilters.branchInterests
          )}
          {sidebarFilters.programTypes && sidebarFilters.programTypes.length > 0 && renderGroup(
            'Program Type',
            'programTypes',
            sidebarFilters.programTypes
          )}
        </div>
      </div>

      {/* Premium CTA */}
      <div className="bg-linear-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white shadow-xl">
        <h4 className="font-bold text-lg mb-2">Unlock All Predictions</h4>
        <p className="text-indigo-100 text-sm mb-4 leading-relaxed">
          Get detailed analysis, career counseling support, and 100% accurate
          college match for your rank.
        </p>
        <button
          onClick={() => alert('Premium features coming soon!')}
          className="w-full py-2.5 bg-white text-indigo-600 font-bold rounded-xl hover:bg-opacity-90 transition-all text-sm"
          aria-label="Upgrade to Premium (Coming Soon)"
        >
          Register now
        </button>
      </div>
    </aside>
  );
};
