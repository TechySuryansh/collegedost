"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UIContextType {
    isAskModalOpen: boolean;
    openAskModal: () => void;
    closeAskModal: () => void;
    isShareModalOpen: boolean;
    openShareModal: () => void;
    closeShareModal: () => void;
    isAuthModalOpen: boolean; // Re-exporting or separate? AuthContext already has it.
    // Actually, AuthContext manages AuthModal. Let's keep UIContext for Ask/Share.
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider = ({ children }: { children: ReactNode }) => {
    const [isAskModalOpen, setIsAskModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    const openAskModal = () => setIsAskModalOpen(true);
    const closeAskModal = () => setIsAskModalOpen(false);

    const openShareModal = () => setIsShareModalOpen(true);
    const closeShareModal = () => setIsShareModalOpen(false);

    return (
        <UIContext.Provider value={{
            isAskModalOpen,
            openAskModal,
            closeAskModal,
            isShareModalOpen,
            openShareModal,
            closeShareModal,
            isAuthModalOpen: false, // Placeholder if needed, but AuthContext handles this.
        }}>
            {children}
        </UIContext.Provider>
    );
};

export const useUI = () => {
    const context = useContext(UIContext);
    if (context === undefined) {
        throw new Error('useUI must be used within a UIProvider');
    }
    return context;
};
