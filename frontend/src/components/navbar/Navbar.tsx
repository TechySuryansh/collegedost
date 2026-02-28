"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { megaMenuItems } from '@/data/megaMenuData';
import {
  FaBars,
  FaChevronDown,
  FaUserShield,
  FaArrowLeft,
} from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import SearchBar from './SearchBar';
import SearchDropdown from './SearchDropdown';
import UserMenu from './UserMenu';
import AdminBar from './AdminBar';
import MegaMenu from './MegaMenu';
import Mobile from './Mobile';
import api from '@/api/axios';

// ──────────────────────────────────────────────────────────
// Navbar Component — 3-level Shiksha-style mega menu
// ──────────────────────────────────────────────────────────
const Navbar = () => {
  const { user, logout, openAuthModal } = useAuth();
  const pathname = usePathname();
  const isAdminMode = pathname?.startsWith('/admin') || false;

  /* ── Desktop mega-menu state ── */
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [activeSubIdx, setActiveSubIdx] = useState<number>(0);
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);

  /* ── Mobile state ── */
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  /* ── User dropdown ── */
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  /* ── Search state ── */
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ colleges: any[], exams: any[], courses: any[] }>({
    colleges: [],
    exams: [],
    courses: []
  });
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Debounced Search
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      // Don't hide dropdown here — trending searches should show on focus
      setSearchResults({ colleges: [], exams: [], courses: [] });
      setIsSearchLoading(false);
      return;
    }

    setIsSearchLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await api.get(`/search?q=${encodeURIComponent(searchQuery)}`);
        if (res.data.success) {
          setSearchResults(res.data.data);
        }
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setIsSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close search results on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ─── Desktop hover handlers ────────────────────────────
  const openMenu = useCallback((idx: number) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setActiveMenu(idx);
    setActiveSubIdx(0);
  }, []);

  const scheduleClose = useCallback(() => {
    dropdownTimeout.current = setTimeout(() => {
      setActiveMenu(null);
      setActiveSubIdx(0);
    }, 180);
  }, []);

  const cancelClose = useCallback(() => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
  }, []);

  const closeAll = useCallback(() => {
    setActiveMenu(null);
    setActiveSubIdx(0);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeout.current) {
        clearTimeout(dropdownTimeout.current);
        dropdownTimeout.current = null;
      }
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsUserDropdownOpen(false);
  };

  // ═══════════════════════════════════════════════════════
  // JSX
  // ═══════════════════════════════════════════════════════
  return (
    <nav
      className={`sticky top-0 z-50 ${isAdminMode
        ? 'bg-slate-900 border-b border-slate-800'
        : 'bg-white border-b border-gray-200 shadow-sm'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ────── ROW 1: Logo + Search + Auth ────── */}
        <div className="flex items-center justify-between h-14 border-b border-gray-100">
          {/* LEFT: Hamburger + Logo */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              className="lg:hidden text-gray-500 text-xl"
              onClick={() => setIsMobileOpen(true)}
              aria-label="Open menu"
            >
              <FaBars />
            </button>

            <Link href="/" className="flex items-center gap-2">
              {isAdminMode ? (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-primary text-white">
                    <FaUserShield className="text-lg" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-display font-bold text-lg text-white">
                      Admin Panel
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <FaArrowLeft className="text-[8px]" /> Back to Site
                    </span>
                  </div>
                </div>
              ) : (
                <span className="font-display font-bold text-2xl tracking-tight text-primary">
                  COLLEGE DOST
                </span>
              )}
            </Link>
          </div>

          {/* CENTER: Search Bar */}
          {!isAdminMode && (
            <div className="hidden md:flex flex-1 max-w-2xl mx-8 relative" ref={searchContainerRef}>
              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onFocus={() => setShowSearchResults(true)}
                onClear={() => {
                  setSearchQuery('');
                  setShowSearchResults(false);
                }}
                onSearch={() => {
                  if (searchQuery.trim()) {
                    window.location.href = `/tools/colleges?search=${encodeURIComponent(searchQuery)}`;
                  }
                }}
                isActive={showSearchResults}
              />
              <SearchDropdown
                results={searchResults}
                isVisible={showSearchResults}
                onClose={() => {
                  setShowSearchResults(false);
                  setSearchQuery('');
                }}
                isLoading={isSearchLoading}
                searchQuery={searchQuery}
              />
            </div>
          )}

          {/* RIGHT: Auth / User */}
          <UserMenu
            user={user}
            isAdminMode={isAdminMode}
            isUserDropdownOpen={isUserDropdownOpen}
            onToggleDropdown={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            onCloseDropdown={() => setIsUserDropdownOpen(false)}
            onLogout={handleLogout}
            onOpenAuthModal={openAuthModal}
          />
        </div>

        {/* ────── ROW 2: Menu Items (centered) ────── */}
        {!isAdminMode && (
          <div className="hidden lg:flex items-center justify-center h-12">
            {megaMenuItems.map((item, idx) => (
              <div
                key={item.title}
                className="relative"
                onMouseEnter={() => openMenu(idx)}
                onMouseLeave={scheduleClose}
              >
                <button
                  className={`flex items-center gap-1 px-3 py-2 text-[12px] font-bold uppercase tracking-wider transition-colors ${activeMenu === idx
                    ? 'text-primary'
                    : 'text-gray-700 hover:text-primary'
                    }`}
                >
                  {item.title}
                  <FaChevronDown
                    className={`text-[8px] opacity-60 transition-transform duration-200 ${activeMenu === idx ? 'rotate-180' : ''
                      }`}
                  />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ────── Admin Nav (desktop, admin mode) ────── */}
        {isAdminMode && <AdminBar pathname={pathname} />}
      </div>

      {/* ════ DESKTOP MEGA-MENU DROPDOWN ════ */}
      {!isAdminMode && activeMenu !== null && (
        <MegaMenu
          activeMenu={activeMenu}
          activeSubIdx={activeSubIdx}
          onSubHover={setActiveSubIdx}
          onCancelClose={cancelClose}
          onScheduleClose={scheduleClose}
          onCloseAll={closeAll}
        />
      )}

      {/* ════ MOBILE SIDEBAR ════ */}
      <Mobile
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        user={user}
        onOpenAuthModal={openAuthModal}
      />

      {/* ════ SEARCH OVERLAY (Shiksha-style dimming) ════ */}
      {showSearchResults && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => {
            setShowSearchResults(false);
            setSearchQuery('');
          }}
        />
      )}
    </nav>
  );
};

export default Navbar;
