import React from 'react';
import { FaChevronDown } from 'react-icons/fa';
import Link from 'next/link';

interface UserMenuProps {
  user: any;
  isAdminMode: boolean;
  isUserDropdownOpen: boolean;
  onToggleDropdown: () => void;
  onCloseDropdown: () => void;
  onLogout: () => void;
  onOpenAuthModal: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({
  user,
  isAdminMode,
  isUserDropdownOpen,
  onToggleDropdown,
  onCloseDropdown,
  onLogout,
  onOpenAuthModal,
}) => {
  if (!user) {
    return (
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onOpenAuthModal}
          className="inline-flex items-center px-5 py-2 text-sm font-semibold rounded-full text-white bg-primary hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
        >
          Login
        </button>
        <button
          onClick={onOpenAuthModal}
          className="hidden sm:inline-flex items-center px-5 py-2 text-sm font-semibold rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors"
        >
          Sign Up
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 shrink-0">
      <div className="relative">
        <button
          onClick={onToggleDropdown}
          className={`flex items-center gap-2 border px-3 py-1.5 rounded-full transition-colors ${
            isAdminMode
              ? 'bg-slate-800 border-slate-700 text-slate-200'
              : 'bg-white border-gray-200 text-gray-700 hover:border-primary/30'
          }`}
        >
          <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm bg-primary text-white">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <span className="text-sm font-medium hidden md:block max-w-25 truncate">
            {user?.name || 'Guest'}
          </span>
          <FaChevronDown className="text-xs text-gray-400" />
        </button>

        {isUserDropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={onCloseDropdown}
            />
            <div
              className={`absolute right-0 mt-2 w-56 rounded-xl shadow-xl border py-2 z-50 ${
                isAdminMode
                  ? 'bg-slate-800 border-slate-700'
                  : 'bg-white border-gray-100'
              }`}
            >
              <div
                className={`px-4 py-3 border-b ${
                  isAdminMode ? 'border-slate-700' : 'border-gray-100'
                }`}
              >
                <p
                  className={`text-sm font-bold truncate ${
                    isAdminMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {user.name}
                </p>
                <p
                  className={`text-xs truncate ${
                    isAdminMode ? 'text-slate-400' : 'text-gray-500'
                  }`}
                >
                  {user.email}
                </p>
              </div>
              <Link
                href="/profile"
                onClick={onCloseDropdown}
                className={`block px-4 py-2.5 text-sm ${
                  isAdminMode
                    ? 'text-slate-300 hover:bg-slate-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Profile Settings
              </Link>
              {user.role === 'admin' && (
                <Link
                  href="/admin"
                  onClick={onCloseDropdown}
                  className={`block px-4 py-2.5 text-sm ${
                    isAdminMode
                      ? 'text-slate-300 hover:bg-slate-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Admin Panel
                </Link>
              )}
              <button
                onClick={onLogout}
                className={`w-full text-left px-4 py-2.5 text-sm ${
                  isAdminMode
                    ? 'text-red-400 hover:bg-slate-700'
                    : 'text-red-600 hover:bg-red-50'
                }`}
              >
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserMenu;
