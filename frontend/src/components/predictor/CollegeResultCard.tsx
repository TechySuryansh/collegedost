"use client";

import React from 'react';
import {
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaTimes,
} from 'react-icons/fa';
import type { CollegeResultCardProps, AdmissionChance } from './types';

const chanceBadge: Record<
  AdmissionChance,
  { label: string; icon: React.ReactNode; classes: string }
> = {
  high: {
    label: 'High Chance',
    icon: <FaCheckCircle className="text-xs" />,
    classes:
      'bg-emerald-50 text-emerald-700 border-emerald-100',
  },
  medium: {
    label: 'Medium Chance',
    icon: <FaClock className="text-xs" />,
    classes: 'bg-amber-50 text-amber-700 border-amber-100',
  },
  low: {
    label: 'Low Chance',
    icon: <FaExclamationTriangle className="text-xs" />,
    classes: 'bg-rose-50 text-rose-700 border-rose-100',
  },
  'not-eligible': {
    label: 'Not Eligible',
    icon: <FaTimes className="text-xs" />,
    classes: 'bg-gray-50 text-gray-700 border-gray-100',
  },
};

export const CollegeResultCard: React.FC<CollegeResultCardProps> = ({
  college,
  onViewDetails,
}) => {
  const badge = chanceBadge[college.chance];

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 p-6 flex flex-col md:flex-row gap-6 relative overflow-hidden group">
      {/* Chance Badge */}
      <div className="absolute top-0 right-0 pt-4 pr-6">
        <span
          className={`${badge.classes} px-4 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5`}
        >
          {badge.icon} {badge.label}
        </span>
      </div>

      {/* Institution Logo Placeholder */}
      <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-50 rounded-2xl flex items-center justify-center p-4 shrink-0 border border-gray-100 group-hover:border-indigo-200 transition-colors">
        <span className="font-display font-black text-3xl text-gray-300">
          {college.institutionAbbrev}
        </span>
      </div>

      {/* Details */}
      <div className="grow flex flex-col justify-between py-1">
        <div>
          <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors pr-32 md:pr-40">
            {college.collegeName}
          </h3>
          <div className="flex flex-wrap gap-4 mt-2">
            {college.location && (
              <span className="text-sm text-slate-500 flex items-center gap-1.5">
                <FaMapMarkerAlt className="text-xs" /> {college.location}
              </span>
            )}
            {college.nirfRank && college.nirfRank < 999 && (
              <span className="text-sm text-slate-500 flex items-center gap-1.5">
                <FaGraduationCap className="text-xs" /> NIRF Rank:{' '}
                {college.nirfRank}
              </span>
            )}
          </div>
        </div>

        {/* Bottom row with details */}
        <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Course Name
            </p>
            <p className="text-sm font-semibold mt-0.5 text-slate-800">
              {college.course}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Quota
            </p>
            <p className="text-sm font-semibold mt-0.5 text-slate-800">
              {college.quota}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Previous Closing
            </p>
            <p className="text-sm font-bold text-indigo-600 mt-0.5">
              {college.closingRank
                ? college.closingRank.toLocaleString('en-IN')
                : '—'}
            </p>
          </div>
          <div className="flex items-center justify-end">
            <button
              onClick={onViewDetails}
              disabled={!onViewDetails}
              className="text-indigo-600 font-bold text-sm hover:underline disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
