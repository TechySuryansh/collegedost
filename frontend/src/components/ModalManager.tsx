"use client";

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useUI } from '@/context/UIContext';
import AuthModal from './AuthModal';
import AskModal from './AskModal';
import ShareModal from './ShareModal';

const ModalManager: React.FC = () => {
    const { isAuthModalOpen, closeAuthModal } = useAuth();
    const { isAskModalOpen, closeAskModal, isShareModalOpen, closeShareModal } = useUI();

    return (
        <>
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={closeAuthModal}
            />
            <AskModal
                isOpen={isAskModalOpen}
                onClose={closeAskModal}
            />
            <ShareModal
                isOpen={isShareModalOpen}
                onClose={closeShareModal}
            />
        </>
    );
};

export default ModalManager;
