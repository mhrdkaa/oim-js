'use client';

import { signOut } from 'next-auth/react';
import { FaSignOutAlt, FaBars } from 'react-icons/fa';

interface NavbarProps {
  user: {
    name?: string | null;
    role?: string;
  };
  onMenuClick: () => void;
}

export default function Navbar({ user, onMenuClick }: NavbarProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-4 md:px-6 py-4">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-600 hover:text-gray-800 p-2"
          aria-label="Toggle menu"
        >
          <FaBars className="text-xl" />
        </button>

        {/* Title */}
        <div className="flex-1 lg:flex-initial">
          <h2 className="text-base md:text-xl font-semibold text-gray-800">
            Monitoring Air Coolant
          </h2>
          <p className="text-xs md:text-sm text-gray-500">Mesin Wasino SE-52N2</p>
        </div>

        {/* User Info & Logout */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-700">{user.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user.role}</p>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="bg-red-500 hover:bg-red-600 text-white px-3 md:px-4 py-2 rounded-lg transition-colors font-medium flex items-center space-x-2"
          >
            <FaSignOutAlt />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
