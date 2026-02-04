"use client";

import React from 'react';

type SpinnerSize = 'sm' | 'md' | 'lg';
type SpinnerColor = 'blue' | 'green' | 'orange' | 'indigo' | 'brand-blue' | 'brand-orange' | 'brand-indigo';

interface SpinnerProps {
    size?: SpinnerSize;
    color?: SpinnerColor;
    className?: string;
}

const sizeClasses: Record<SpinnerSize, string> = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-2',
    lg: 'h-12 w-12 border-t-2 border-b-2',
};

const colorClasses: Record<SpinnerColor, string> = {
    blue: 'border-blue-600',
    green: 'border-green-600',
    orange: 'border-orange-500',
    indigo: 'border-indigo-600',
    'brand-blue': 'border-brand-blue',
    'brand-orange': 'border-brand-orange',
    'brand-indigo': 'border-brand-indigo',
};

/**
 * Reusable loading spinner component.
 * Replaces duplicate spinner implementations across the codebase.
 */
export const Spinner: React.FC<SpinnerProps> = ({
    size = 'md',
    color = 'brand-blue',
    className = '',
}) => {
    return (
        <div
            className={`animate-spin rounded-full ${sizeClasses[size]} ${colorClasses[color]} border-t-transparent ${className}`}
            role="status"
            aria-label="Loading"
        />
    );
};

export default Spinner;
