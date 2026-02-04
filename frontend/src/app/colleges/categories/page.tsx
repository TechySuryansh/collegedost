
import React from 'react';
import type { Metadata } from 'next';
import AllCategoriesClient from './AllCategoriesClient';

export const metadata: Metadata = {
    title: 'All Categories | CollegeDost',
    description: 'Explore all education categories including Engineering, Medical, MBA, Law, and more.',
};

const AllCategoriesPage = () => {
    return <AllCategoriesClient />;
};

export default AllCategoriesPage;
