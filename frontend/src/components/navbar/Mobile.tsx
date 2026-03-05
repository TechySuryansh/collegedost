import React, { useState } from 'react';
import {
  FaChevronDown,
  FaAngleRight,
  FaTimes,
} from 'react-icons/fa';
import { megaMenuItems } from '@/data/megaMenuData';
import Link from 'next/link';

interface MobileProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onOpenAuthModal: () => void;
}

const Mobile: React.FC<MobileProps> = ({
  isOpen,
  onClose,
  user,
  onOpenAuthModal,
}) => {
  const [menuIdx, setMenuIdx] = useState<number | null>(null);
  const [subIdx, setSubIdx] = useState<number | null>(null);

  const closeMobile = () => {
    onClose();
    setMenuIdx(null);
    setSubIdx(null);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-999 lg:hidden"
        onClick={closeMobile}
      />

      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-screen w-[85%] max-w-100 bg-white z-1000 lg:hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <span className="font-display font-bold text-xl text-primary">
            COLLEGE DOST
          </span>
          <button
            onClick={closeMobile}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500"
            aria-label="Close menu"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {megaMenuItems.map((item, mIdx) => (
            <div key={mIdx} className="border-b border-gray-50">
              {/* Level 1 */}
              <button
                onClick={() => {
                  setMenuIdx(menuIdx === mIdx ? null : mIdx);
                  setSubIdx(null);
                }}
                className="flex items-center justify-between w-full px-5 py-3.5 text-left text-gray-800 font-semibold text-[15px]"
              >
                {item.title}
                <FaChevronDown
                  className={`text-xs text-gray-400 transition-transform duration-200 ${
                    menuIdx === mIdx ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Level 2 (subcategories) */}
              {menuIdx === mIdx && (
                <div className="bg-gray-50/60">
                  {item.subcategories.map((sub, sIdx) => {
                    const hasContent = sub.columns.length > 0;

                    if (!hasContent && sub.directLink) {
                      return (
                        <Link
                          key={sIdx}
                          href={sub.directLink}
                          onClick={closeMobile}
                          className="block px-8 py-2.5 text-sm text-gray-600 hover:text-primary"
                        >
                          {sub.title}
                        </Link>
                      );
                    }

                    if (!hasContent) return null;

                    return (
                      <div key={sIdx}>
                        <button
                          onClick={() =>
                            setSubIdx(subIdx === sIdx ? null : sIdx)
                          }
                          className="flex items-center justify-between w-full px-8 py-2.5 text-left text-sm text-gray-700 font-medium"
                        >
                          {sub.title}
                          <FaAngleRight
                            className={`text-[10px] text-gray-400 transition-transform duration-200 ${
                              subIdx === sIdx ? 'rotate-90' : ''
                            }`}
                          />
                        </button>

                        {/* Level 3 (links) */}
                        {subIdx === sIdx && (
                          <div className="bg-white px-10 py-2 space-y-0.5">
                            {sub.columns
                              .flatMap((col) => col.links)
                              .map((link, lIdx) => {
                                if (link.isHeader) {
                                  return (
                                    <div
                                      key={lIdx}
                                      className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pt-3 pb-1 first:pt-0"
                                    >
                                      {link.label}
                                    </div>
                                  );
                                }
                                return (
                                  <Link
                                    key={lIdx}
                                    href={link.href}
                                    onClick={closeMobile}
                                    className={`block py-1 text-[13px] transition-colors ${
                                      link.isViewAll
                                        ? 'text-primary font-semibold'
                                        : 'text-gray-600 hover:text-primary'
                                    }`}
                                  >
                                    {link.label}
                                  </Link>
                                );
                              })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        {!user && (
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={() => {
                closeMobile();
                onOpenAuthModal();
              }}
              className="w-full py-3 bg-primary text-white font-medium rounded-full"
            >
              Login / Signup
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Mobile;
