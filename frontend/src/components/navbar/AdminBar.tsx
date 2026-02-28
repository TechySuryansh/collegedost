import React from 'react';
import Link from 'next/link';
import { FaChartPie, FaUniversity, FaNewspaper, FaUserShield, FaCode } from 'react-icons/fa';
import { AdminLink } from './types';

const adminLinks: AdminLink[] = [
  { title: 'Dashboard', href: '/admin', icon: FaChartPie },
  { title: 'Colleges', href: '/admin/colleges', icon: FaUniversity },
  { title: 'Articles', href: '/admin/articles', icon: FaNewspaper },
  { title: 'Users', href: '/admin/users', icon: FaUserShield },
  { title: 'Site Settings', href: '/admin/site-settings', icon: FaCode },
];

interface NavAdminBarProps {
  pathname: string | null;
}

const NavAdminBar: React.FC<NavAdminBarProps> = ({ pathname }) => (
  <div className="hidden lg:flex items-center justify-center gap-6 h-12 border-t border-slate-700">
    {adminLinks.map((link) => {
      const isActive =
        link.href === '/admin'
          ? pathname === '/admin'
          : pathname?.startsWith(link.href);
      return (
        <Link
          key={link.href}
          href={link.href}
          className={`flex items-center gap-2 text-sm font-medium ${isActive ? 'text-white' : 'text-slate-400 hover:text-white'
            }`}
        >
          <link.icon className={isActive ? 'text-primary' : ''} />
          {link.title}
        </Link>
      );
    })}
  </div>
);

export default NavAdminBar;
