import React from 'react';
import { Spinner } from './Spinner';

type SpinnerColor = 'blue' | 'green' | 'orange' | 'indigo' | 'brand-blue' | 'brand-orange' | 'brand-indigo';

interface PageLoaderProps {
    color?: SpinnerColor;
}

/**
 * Full-page loading state component.
 * Used as Suspense fallback for page-level async operations.
 */
export const PageLoader: React.FC<PageLoaderProps> = ({ color = 'brand-blue' }) => {
    return (
        <div className="min-h-screen pt-24 flex justify-center items-center">
            <Spinner size="md" color={color} />
        </div>
    );
};

export default PageLoader;
