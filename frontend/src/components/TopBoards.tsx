"use client";

import React from 'react';
import Link from 'next/link';

const boards = [
    { name: 'GSEB HSC', slug: 'gseb-hsc' },
    { name: 'Maharashtra SSC', slug: 'maharashtra-ssc' },
    { name: 'Karnataka 2nd PUC', slug: 'karnataka-2nd-puc' },
    { name: 'GSEB SSC', slug: 'gseb-ssc' },
    { name: 'Tamilnadu 12th', slug: 'tamilnadu-12th' },
    { name: 'UP 12th', slug: 'up-12th' },
    { name: 'Odisha CHSE', slug: 'odisha-chse' },
    { name: 'PSEB 12th', slug: 'pseb-12th' },
    { name: 'Maharashtra HSC', slug: 'maharashtra-hsc' },
    { name: 'CBSE 12th', slug: 'cbse-12th' },
];

const TopBoards: React.FC = () => {
    return (
        <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Boards in India</h2>
            <div className="flex flex-wrap justify-center gap-3">
                {boards.map((board) => (
                    <Link
                        key={board.slug}
                        href={`/boards/${board.slug}`}
                        className="px-6 py-2 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium whitespace-nowrap bg-white shadow-sm"
                    >
                        {board.name}
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default TopBoards;
