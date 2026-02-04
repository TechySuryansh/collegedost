"use client";

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface AdminLayoutProps {
    children: ReactNode;
}

/**
 * Admin Layout wrapper component.
 * Provides consistent styling and animations for all admin pages.
 */
const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50/50 pt-24 lg:pt-36 px-4 md:px-8 pb-12 transition-all duration-300">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="max-w-7xl mx-auto"
            >
                {children}
            </motion.div>
        </div>
    );
};

export default AdminLayout;
