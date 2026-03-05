import React from 'react';
import { megaMenuItems, MegaMenuLink } from '@/data/megaMenuData';
import { FaAngleRight } from 'react-icons/fa';
import Link from 'next/link';

interface MegaMenuProps {
  activeMenu: number;
  activeSubIdx: number;
  onSubHover: (idx: number) => void;
  onCancelClose: () => void;
  onScheduleClose: () => void;
  onCloseAll: () => void;
}

/** Renders a single Level-3 link in the mega menu content area. */
const L3Link = ({
  link,
  onClick,
}: {
  link: MegaMenuLink;
  onClick?: () => void;
}) => {
  if (link.isHeader) {
    return (
      <li className="mb-1.5 mt-4 first:pt-0">
        <span className="text-[11px] font-bold text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-1 block">
          {link.label}
        </span>
      </li>
    );
  }
  if (link.isSubHeader) {
    return (
      <li className="mb-1 mt-3 first:mt-0">
        <span className="text-[12px] font-bold text-gray-700 tracking-wide block">
          {link.label}
        </span>
      </li>
    );
  }
  return (
    <li>
      <Link
        href={link.href}
        onClick={onClick}
        className={`text-[13px] leading-relaxed block py-0.75 transition-colors ${link.isViewAll
            ? 'text-primary font-semibold mt-1.5 hover:underline'
            : 'text-gray-600 hover:text-primary'
          }`}
      >
        {link.label}
      </Link>
    </li>
  );
};

const MegaMenu: React.FC<MegaMenuProps> = ({
  activeMenu,
  activeSubIdx,
  onSubHover,
  onCancelClose,
  onScheduleClose,
  onCloseAll,
}) => {
  const menuItem = megaMenuItems[activeMenu];
  if (!menuItem) return null;

  const activeSub = menuItem.subcategories[activeSubIdx];
  const colCount = activeSub?.columns?.length ?? 0;

  return (
    <div
      className="absolute left-0 right-0 top-full z-40"
      onMouseEnter={onCancelClose}
      onMouseLeave={onScheduleClose}
    >
      <div className="max-w-4xl mx-auto px-4">
        <div
          className="bg-white shadow-2xl rounded-b-xl border border-t-0 border-gray-100 overflow-hidden flex"
          style={{ maxHeight: '480px' }}
        >
          {/* Level 2: Sidebar */}
          <div className="w-55 bg-gray-50/80 border-r border-gray-100 overflow-y-auto shrink-0 py-1">
            {menuItem.subcategories.map((sub, sIdx) => {
              const isActive = activeSubIdx === sIdx;
              const hasContent = sub.columns.length > 0;

              if (sub.directLink && !hasContent) {
                return (
                  <Link
                    key={sIdx}
                    href={sub.directLink}
                    onClick={onCloseAll}
                    onMouseEnter={() => onSubHover(sIdx)}
                    className={`flex items-center justify-between px-5 py-2.5 text-[13px] font-medium transition-all ${isActive
                        ? 'text-primary bg-white border-l-[3px] border-primary'
                        : 'text-gray-700 hover:text-primary border-l-[3px] border-transparent'
                      }`}
                  >
                    {sub.title}
                  </Link>
                );
              }

              return (
                <div
                  key={sIdx}
                  onMouseEnter={() => onSubHover(sIdx)}
                  className={`flex items-center justify-between px-5 py-2.5 text-[13px] font-medium cursor-default transition-all ${isActive
                      ? 'text-primary bg-white border-l-[3px] border-primary'
                      : 'text-gray-700 hover:text-primary border-l-[3px] border-transparent'
                    }`}
                >
                  <span>{sub.title}</span>
                  {hasContent && (
                    <FaAngleRight className="text-[10px] opacity-40" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Level 3: Content columns */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeSub && colCount > 0 && (
              <div
                className={`grid gap-8 ${colCount >= 3
                    ? 'grid-cols-3'
                    : colCount === 2
                      ? 'grid-cols-2'
                      : 'grid-cols-1'
                  }`}
              >
                {activeSub.columns.map((col, cIdx) => (
                  <ul key={cIdx} className="space-y-0">
                    {col.links.map((link, lIdx) => (
                      <L3Link key={lIdx} link={link} onClick={onCloseAll} />
                    ))}
                  </ul>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
