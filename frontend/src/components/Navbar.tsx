"use client";

import React, { useState, useEffect } from 'react';
import {
    navLinks,
    browseByStreamData,
    collegesData,
    examsData,
} from '../data/navigation';
import { FaSearch, FaBell, FaUser, FaBars, FaChevronDown, FaAngleRight, FaTimes, FaChartPie, FaUniversity, FaNewspaper, FaUserShield, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';


// Reusable mega menu content grid
const MegaMenuContentGrid = ({ 
    dataObj, 
    content, 
    onLinkClick,
}: { 
    dataObj: any; 
    content: any; 
    onLinkClick: () => void;
}) => {
    return (
        <div className="flex-1 bg-slate-50 p-10 overflow-y-auto">
            <div className="grid grid-cols-2 gap-16">
                <div className="flex flex-col">
                    <div className="mb-8">
                        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">
                            {dataObj.titles?.col1 || 'Exams'}
                        </h4>
                        <ul className="flex flex-col gap-3">
                            {content.exams?.map((item: any, idx: number) => (
                                <li key={idx}>
                                    <Link href={item.href} onClick={onLinkClick} className={`text-sm block ${item.isLink ? 'text-primary font-semibold' : 'text-slate-600 hover:text-primary'}`}>
                                        {item.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">
                            {dataObj.titles?.col3_1 || 'Predictors'}
                        </h4>
                        <ul className="flex flex-col gap-3">
                            {content.predictors?.map((item: any, idx: number) => (
                                <li key={idx}>
                                    <Link href={item.href} onClick={onLinkClick} className={`text-sm block ${item.isLink ? 'text-primary font-semibold' : 'text-slate-600 hover:text-primary'}`}>
                                        {item.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="flex flex-col">
                    <div className="mb-8">
                        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">
                            {dataObj.titles?.col2 || 'Colleges'}
                        </h4>
                        <ul className="flex flex-col gap-3">
                            {content.colleges?.map((item: any, idx: number) => (
                                <li key={idx}>
                                    <Link href={item.href} onClick={onLinkClick} className="text-sm block text-gray-600 hover:text-primary">
                                        {item.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">
                            {dataObj.titles?.col3_2 || 'Resources'}
                        </h4>
                        <ul className="flex flex-col gap-3">
                            {content.resources?.map((item: any, idx: number) => (
                                <li key={idx}>
                                    <Link href={item.href} onClick={onLinkClick} className="text-sm flex items-center gap-2 text-gray-600 hover:text-primary">
                                        <span>{item.title}</span>
                                        {item.isNew && <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">NEW</span>}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Navbar = () => {
    const { user, logout, openAuthModal } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const isAdminMode = pathname?.startsWith('/admin') || false;
    
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [activeStream, setActiveStream] = useState('engineering');
    const [activeCollegeStream, setActiveCollegeStream] = useState('top-colleges');
    const [activeExamStream, setActiveExamStream] = useState('engineering');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

    const handleLogout = () => {
        logout();
        setIsUserDropdownOpen(false);
    };

    const handleMouseEnter = (title: string) => {
        setActiveDropdown(title);
    };

    const handleMouseLeave = () => {
        setActiveDropdown(null);
    };

    // Find the active stream data
    const currentStreamDataObj = (browseByStreamData.find((s: any) => s.id === activeStream) || {}) as any;
    const currentStreamContent = currentStreamDataObj.content || { exams: [], colleges: [], predictors: [], resources: [] };

    // Find active college data
    const currentCollegeDataObj = (collegesData.find((s: any) => s.id === activeCollegeStream) || {}) as any;
    const currentCollegeContent = currentCollegeDataObj.content || { exams: [], colleges: [], predictors: [], resources: [] };

    // Find active exam data
    const currentExamDataObj = (examsData.find((s: any) => s.id === activeExamStream) || {}) as any;
    const currentExamContent = currentExamDataObj.content || { exams: [], colleges: [], predictors: [], resources: [] };

    const adminLinks = [
        { title: 'Dashboard', href: '/admin', icon: FaChartPie },
        { title: 'Colleges', href: '/admin/colleges', icon: FaUniversity },
        { title: 'Articles', href: '/admin/articles', icon: FaNewspaper },
        { title: 'Users', href: '/admin/users', icon: FaUserShield },
    ];

    return (
        <nav className={`sticky top-0 z-50 glass-card border-b ${isAdminMode ? 'bg-slate-900 border-slate-800' : 'border-gray-200'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* LEFT: Logo + Nav Links */}
                    <div className="flex items-center gap-8">
                        {/* Mobile Menu Toggle */}
                        <button
                            className="lg:hidden text-text-muted-light text-xl"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <FaBars />
                        </button>

                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2">
                            {isAdminMode ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-primary text-white">
                                        <FaUserShield className="text-lg" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-display font-bold text-lg text-white">Admin Panel</span>
                                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                            <FaArrowLeft className="text-[8px]" /> Back to Site
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <span className="font-display font-bold text-2xl tracking-tight text-primary">COLLEGEDOST</span>
                            )}
                        </Link>

                        {/* Desktop Nav Links */}
                        <div className="hidden lg:flex items-center space-x-6">
                            {isAdminMode ? (
                                adminLinks.map((link) => {
                                    const isActive = (link.href === '/admin' ? pathname === '/admin' : pathname?.startsWith(link.href));
                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className={`flex items-center gap-2 text-sm font-medium ${isActive ? 'text-white' : 'text-slate-400 hover:text-white'}`}
                                        >
                                            <link.icon className={isActive ? 'text-primary' : ''} />
                                            {link.title}
                                        </Link>
                                    );
                                })
                            ) : (
                                navLinks.map((link: any) => (
                                    <div
                                        key={link.title}
                                        className="relative"
                                        onMouseEnter={() => handleMouseEnter(link.title)}
                                        onMouseLeave={handleMouseLeave}
                                    >
                                        <button className="flex items-center text-sm font-medium text-text-muted-light hover:text-primary">
                                            {link.title}
                                            {link.hasDropdown && <FaChevronDown className="ml-1 text-[10px]" />}
                                        </button>

                                        {/* Mega Menu - Browse by Stream */}
                                        {link.title === 'Browse by Stream' && activeDropdown === 'Browse by Stream' && (
                                            <div className="fixed left-1/2 -translate-x-1/2 top-16 w-225 bg-white shadow-2xl rounded-xl border border-gray-100 overflow-hidden flex max-h-150">
                                                <div className="w-72 bg-white shrink-0 py-4 overflow-y-auto border-r border-gray-100">
                                                    {browseByStreamData.map((stream: any) => (
                                                        <div
                                                            key={stream.id}
                                                            className={`flex items-center justify-between px-6 py-3 text-sm font-medium cursor-pointer ${activeStream === stream.id ? 'bg-slate-50 text-primary font-semibold' : 'text-gray-600 hover:bg-slate-50 hover:text-primary'}`}
                                                            onMouseEnter={() => setActiveStream(stream.id)}
                                                            onClick={() => {
                                                                if (stream.link) {
                                                                    router.push(stream.link);
                                                                    setActiveDropdown(null);
                                                                }
                                                            }}
                                                        >
                                                            <span>{stream.label}</span>
                                                            <FaAngleRight className="text-xs opacity-50" />
                                                        </div>
                                                    ))}
                                                </div>
                                                <MegaMenuContentGrid 
                                                    dataObj={currentStreamDataObj} 
                                                    content={currentStreamContent} 
                                                    onLinkClick={() => setActiveDropdown(null)}
                                                />
                                            </div>
                                        )}

                                        {/* Mega Menu - Colleges */}
                                        {link.title === 'Colleges' && activeDropdown === 'Colleges' && (
                                            <div className="fixed left-1/2 -translate-x-1/2 top-16 w-225 bg-white shadow-2xl rounded-xl border border-gray-100 overflow-hidden flex max-h-150">
                                                <div className="w-72 bg-white shrink-0 py-4 overflow-y-auto border-r border-gray-100">
                                                    {collegesData.map((stream: any) => (
                                                        <div
                                                            key={stream.id}
                                                            className={`flex items-center justify-between px-6 py-3 text-sm font-medium cursor-pointer ${activeCollegeStream === stream.id ? 'bg-slate-50 text-primary font-semibold' : 'text-gray-600 hover:bg-slate-50 hover:text-primary'}`}
                                                            onMouseEnter={() => setActiveCollegeStream(stream.id)}
                                                        >
                                                            <span>{stream.label}</span>
                                                            <FaAngleRight className="text-xs opacity-50" />
                                                        </div>
                                                    ))}
                                                </div>
                                                <MegaMenuContentGrid 
                                                    dataObj={currentCollegeDataObj} 
                                                    content={currentCollegeContent} 
                                                    onLinkClick={() => setActiveDropdown(null)}
                                                />
                                            </div>
                                        )}

                                        {/* Mega Menu - Exams */}
                                        {link.title === 'Exams' && activeDropdown === 'Exams' && (
                                            <div className="fixed left-1/2 -translate-x-1/2 top-16 w-225 bg-white shadow-2xl rounded-xl border border-gray-100 overflow-hidden flex max-h-150">
                                                <div className="w-72 bg-white shrink-0 py-4 overflow-y-auto border-r border-gray-100">
                                                    {examsData.map((stream: any) => (
                                                        <div
                                                            key={stream.id}
                                                            className={`flex items-center justify-between px-6 py-3 text-sm font-medium cursor-pointer ${activeExamStream === stream.id ? 'bg-slate-50 text-primary font-semibold' : 'text-gray-600 hover:bg-slate-50 hover:text-primary'}`}
                                                            onMouseEnter={() => setActiveExamStream(stream.id)}
                                                        >
                                                            <span>{stream.label}</span>
                                                            <FaAngleRight className="text-xs opacity-50" />
                                                        </div>
                                                    ))}
                                                </div>
                                                <MegaMenuContentGrid 
                                                    dataObj={currentExamDataObj} 
                                                    content={currentExamContent} 
                                                    onLinkClick={() => setActiveDropdown(null)}
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* RIGHT: Actions */}
                    <div className="flex items-center gap-4">
                        {!isAdminMode && (
                            <>
                                <button className="p-2 text-text-muted-light hover:text-primary">
                                    <FaSearch className="text-xl" />
                                </button>
                                <button className="p-2 text-text-muted-light hover:text-primary">
                                    <FaBell className="text-xl" />
                                </button>
                            </>
                        )}

                        {/* User / Login */}
                        {!user ? (
                            <button
                                onClick={openAuthModal}
                                className="hidden md:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-white bg-primary hover:bg-opacity-90 shadow-lg shadow-primary/30"
                            >
                                Login
                            </button>
                        ) : (
                            <div className="relative">
                                <button
                                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                                    className={`flex items-center gap-2 border px-3 py-1.5 rounded-full ${isAdminMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-gray-200 text-gray-700'}`}
                                >
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm ${isAdminMode ? 'bg-primary text-white' : 'bg-primary text-white'}`}>
                                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    <span className="text-sm font-medium hidden md:block max-w-25 truncate">
                                        {user?.name || 'Guest'}
                                    </span>
                                    <FaChevronDown className="text-xs text-gray-400" />
                                </button>

                                {isUserDropdownOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setIsUserDropdownOpen(false)}></div>
                                        <div className={`absolute right-0 mt-2 w-56 rounded-xl shadow-xl border py-2 z-50 ${isAdminMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
                                            <div className={`px-4 py-3 border-b ${isAdminMode ? 'border-slate-700' : 'border-gray-100'}`}>
                                                <p className={`text-sm font-bold truncate ${isAdminMode ? 'text-white' : 'text-gray-900'}`}>{user.name}</p>
                                                <p className={`text-xs truncate ${isAdminMode ? 'text-slate-400' : 'text-gray-500'}`}>{user.email}</p>
                                            </div>
                                            <Link href="/profile" className={`block px-4 py-2.5 text-sm ${isAdminMode ? 'text-slate-300 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                                                Profile Settings
                                            </Link>
                                            {user.role === 'admin' && (
                                                <Link href="/admin" className={`block px-4 py-2.5 text-sm ${isAdminMode ? 'text-slate-300 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                                                    Admin Panel
                                                </Link>
                                            )}
                                            <button
                                                onClick={handleLogout}
                                                className={`w-full text-left px-4 py-2.5 text-sm ${isAdminMode ? 'text-red-400 hover:bg-slate-700' : 'text-red-600 hover:bg-red-50'}`}
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu Sidebar */}
            {isMobileMenuOpen && (
                <>
                    <div className="fixed inset-0 bg-black/60 z-999 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
                    <div className="fixed top-0 left-0 h-screen w-[85%] max-w-100 bg-white z-1000 lg:hidden shadow-2xl flex flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                            <span className="font-display font-bold text-xl text-primary">COLLEGEDOST</span>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500"
                            >
                                <FaTimes className="text-lg" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {/* Categories */}
                            {navLinks.map((link: any) => (
                                <div key={link.title}>
                                    {link.hasDropdown ? (
                                        <div>
                                            <button
                                                onClick={() => setExpandedCategory(expandedCategory === link.title ? null : link.title)}
                                                className="flex items-center justify-between w-full py-3 text-left text-gray-800 font-medium"
                                            >
                                                {link.title}
                                                <FaChevronDown className={`text-xs text-gray-400 ${expandedCategory === link.title ? 'rotate-180' : ''}`} />
                                            </button>
                                            {expandedCategory === link.title && (
                                                <div className="pl-4 pb-2 space-y-2">
                                                    {link.title === 'Browse by Stream' && browseByStreamData.map((stream: any) => (
                                                        <Link
                                                            key={stream.id}
                                                            href={stream.link || '#'}
                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                            className="block py-2 text-sm text-gray-600 hover:text-primary"
                                                        >
                                                            {stream.label}
                                                        </Link>
                                                    ))}
                                                    {link.title === 'Colleges' && collegesData.map((item: any) => (
                                                        <Link
                                                            key={item.id}
                                                            href={`/tools/colleges?stream=${encodeURIComponent(item.label)}`}
                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                            className="block py-2 text-sm text-gray-600 hover:text-primary"
                                                        >
                                                            {item.label}
                                                        </Link>
                                                    ))}
                                                    {link.title === 'Exams' && examsData.map((item: any) => (
                                                        <Link
                                                            key={item.id}
                                                            href={`/exams?category=${encodeURIComponent(item.label)}`}
                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                            className="block py-2 text-sm text-gray-600 hover:text-primary"
                                                        >
                                                            {item.label}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <Link
                                            href={link.href || '#'}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block py-3 text-gray-800 font-medium"
                                        >
                                            {link.title}
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        {!user && (
                            <div className="p-4 border-t border-gray-100">
                                <button
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        openAuthModal();
                                    }}
                                    className="w-full py-3 bg-primary text-white font-medium rounded-full"
                                >
                                    Login / Signup
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </nav>
    );
};

export default Navbar;
