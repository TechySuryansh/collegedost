"use client";

import React, { createContext, useState, useContext, useEffect, useRef, useCallback, ReactNode } from 'react';

interface User {
    _id?: string;
    name?: string;
    email?: string;
    role?: string;
    token?: string;
    [key: string]: any;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (userData: User, token: string) => void;
    logout: () => void;
    isAuthModalOpen: boolean;
    openAuthModal: () => void;
    closeAuthModal: () => void;
    protectAction: (action: () => void) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUser = localStorage.getItem('user');
            const token = localStorage.getItem('token');
            if (storedUser && token) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (e) {
                    console.error("Failed to parse user data", e);
                }
            }
            setLoading(false);
        }
    }, []);

    const login = (userData: User, token: string) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setIsAuthModalOpen(false);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        window.location.href = '/';
    };

    const openAuthModal = () => setIsAuthModalOpen(true);

    // --- Periodic login popup for unauthenticated users ---
    const popupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const getRandomInterval = useCallback(() => {
        // Fixed interval of 1 minute (in ms)
        return 1 * 60 * 1000;
    }, []);

    const clearPopupTimer = useCallback(() => {
        if (popupTimerRef.current !== null) {
            clearTimeout(popupTimerRef.current);
            popupTimerRef.current = null;
        }
    }, []);

    const schedulePopup = useCallback(() => {
        clearPopupTimer();
        const delay = getRandomInterval();
        console.log(`[AuthPopup] Scheduling login popup in ${Math.round(delay / 1000)}s`);
        popupTimerRef.current = setTimeout(() => {
            console.log('[AuthPopup] Showing login popup');
            setIsAuthModalOpen(true);
            popupTimerRef.current = null;
            // Next popup will be scheduled when the user closes this one
        }, delay);
    }, [clearPopupTimer, getRandomInterval]);

    const closeAuthModal = useCallback(() => {
        setIsAuthModalOpen(false);
        // Schedule the next popup after dismiss (only if not logged in)
        // We read user from a ref to avoid stale closure issues
        const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
        const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!storedUser || !storedToken) {
            schedulePopup();
        }
    }, [schedulePopup]);

    // Start/stop the periodic popup based on auth state
    useEffect(() => {
        if (loading) return; // wait until auth state is resolved

        if (user) {
            // Logged in — clear any pending popup timer
            clearPopupTimer();
            return;
        }

        // Not logged in — schedule first popup
        schedulePopup();

        return () => {
            clearPopupTimer();
        };
    }, [user, loading, schedulePopup, clearPopupTimer]);

    const protectAction = (action: () => void) => {
        if (user) {
            action();
        } else {
            openAuthModal();
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            logout,
            isAuthModalOpen,
            openAuthModal,
            closeAuthModal,
            protectAction
        }}>
            {children}
        </AuthContext.Provider>
    );
};
