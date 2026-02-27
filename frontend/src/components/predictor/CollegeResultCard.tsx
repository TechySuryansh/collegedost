"use client";

import React from 'react';
import Link from 'next/link';
import {
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaTimes,
  FaExternalLinkAlt,
} from 'react-icons/fa';
import type { CollegeResultCardProps, AdmissionChance } from './types';

const chanceBadge: Record<
  AdmissionChance,
  { label: string; icon: React.ReactNode; classes: string; barColor: string }
> = {
  high: {
    label: 'High Chance',
    icon: <FaCheckCircle className="text-xs" />,
    classes: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    barColor: 'bg-emerald-500',
  },
  medium: {
    label: 'Medium Chance',
    icon: <FaClock className="text-xs" />,
    classes: 'bg-amber-50 text-amber-700 border-amber-200',
    barColor: 'bg-amber-500',
  },
  low: {
    label: 'Low Chance',
    icon: <FaExclamationTriangle className="text-xs" />,
    classes: 'bg-rose-50 text-rose-700 border-rose-200',
    barColor: 'bg-rose-500',
  },
  'not-eligible': {
    label: 'Not Eligible',
    icon: <FaTimes className="text-xs" />,
    classes: 'bg-gray-50 text-gray-600 border-gray-200',
    barColor: 'bg-gray-400',
  },
};

export const CollegeResultCard: React.FC<CollegeResultCardProps> = ({
  college,
}) => {
  const badge = chanceBadge[college.chance];
  const collegeHref = college.collegeSlug
    ? `/tools/colleges/${college.collegeSlug}`
    : '#';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group relative">
      {/* Colored top accent bar based on chance */}
      <div className={`h-1 ${badge.barColor}`} />

      <div className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
          {/* Institution Logo Placeholder */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 border border-gray-100 group-hover:border-indigo-200 transition-colors">
            <span className="font-display font-black text-xl sm:text-2xl text-gray-300">
              {college.institutionAbbrev}
            </span>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Top row: Name + Badge */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Link
                  href={collegeHref}
                  className="text-lg font-bold text-slate-800 hover:text-indigo-600 transition-colors line-clamp-2 leading-tight"
                >
                  {college.collegeName}
                </Link>
                <div className="flex flex-wrap items-center gap-3 mt-1.5">
                  {college.location && (
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <FaMapMarkerAlt className="text-[10px]" /> {college.location}
                    </span>
                  )}
                  {college.nirfRank && college.nirfRank < 999 && (
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <FaGraduationCap className="text-[10px]" /> NIRF #{college.nirfRank}
                    </span>
                  )}
                </div>
              </div>
              {/* Chance Badge */}
              <span
                className={`${badge.classes} px-3 py-1 rounded-full text-[11px] font-bold border flex items-center gap-1 shrink-0 whitespace-nowrap`}
              >
                {badge.icon} {badge.label}
              </span>
            </div>

            {/* Details Grid */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center gap-x-6 gap-y-2">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Course
                </p>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">
                  {college.course}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Quota
                </p>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">
                  {college.quota}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {college.cutoffLabel || 'Cutoff Rank'}
                </p>
                <p className="text-sm font-bold text-indigo-600 mt-0.5">
                  {college.closingRank
                    ? college.closingRank.toLocaleString('en-IN')
                    : '—'}
                </p>
              </div>
              {/* View Details Link - always visible */}
              <div className="ml-auto">
                <Link
                  href={collegeHref}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  View Details <FaExternalLinkAlt className="text-[10px]" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
