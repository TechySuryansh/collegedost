import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import AuthModal from '../components/AuthModal';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setIsAuthModalOpen(false); // Close modal on login
        // window.location.reload(); // Removed reload to use state
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        window.location.href = '/';
    };

    const openAuthModal = () => setIsAuthModalOpen(true);
    const closeAuthModal = () => setIsAuthModalOpen(false);

    // Guard function for protected actions
    const protectAction = (action) => {
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
            {/* Global Auth Modal controlled by context */}
            {/* Note: We might need to render this at root level if not rendered in App */}
        </AuthContext.Provider>
    );
};
