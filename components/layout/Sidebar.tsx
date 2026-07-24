'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  FaTachometerAlt,
  FaDatabase,
  FaChartBar,
  FaInfoCircle,
  FaUser,
  FaKey,
  FaUsers,
  FaUserCircle
} from 'react-icons/fa';

interface SidebarProps {
  user: {
    name?: string | null;
    role?: string;
  };
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: FaTachometerAlt },
    { href: '/riwayat', label: 'Riwayat Data', icon: FaDatabase },
    { href: '/ringkasan', label: 'Ringkasan Statistik', icon: FaChartBar },
    { href: '/profil-sistem', label: 'Profil Sistem', icon: FaInfoCircle },
    { href: '/profil', label: 'Profil User', icon: FaUser },
    { href: '/ganti-password', label: 'Ganti Password', icon: FaKey },
  ];

  const adminLinks = [
    { href: '/users', label: 'Kelola User', icon: FaUsers },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden">
            <Image
              src="/YKK_Group_Logo.svg.png"
              alt="YKK Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="font-bold text-lg">Monitoring IoT</h1>
            <p className="text-xs text-gray-400">YKK Group</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
            <FaUserCircle className="text-2xl text-white" />
          </div>
          <div>
            <p className="font-medium text-sm">{user.name}</p>
            <p className="text-xs text-gray-400 capitalize">{user.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive(link.href)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
                  }`}
              >
                <Icon className="text-lg" />
                <span className="font-medium">{link.label}</span>
              </Link>
            );
          })}

          {user.role === 'ADMIN' && (
            <>
              <div className="pt-4 pb-2 px-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Admin
                </p>
              </div>
              {adminLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive(link.href)
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                      }`}
                  >
                    <Icon className="text-lg" />
                    <span className="font-medium">{link.label}</span>
                  </Link>
                );
              })}
            </>
          )}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700 text-center">
        <p className="text-xs text-gray-400">© 2026 YKK Group</p>
        <p className="text-xs text-gray-500">Version 2.0</p>
      </div>
    </aside>
  );
}
