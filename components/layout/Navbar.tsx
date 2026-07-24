'use client';

import { signOut } from 'next-auth/react';
import { FaSignOutAlt } from 'react-icons/fa';

interface NavbarProps {
  user: {
    name?: string | null;
    role?: string;
  };
}

export default function Navbar({ user }: NavbarProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Monitoring Air Coolant
          </h2>
          <p className="text-sm text-gray-500">Mesin Wasino SE-52N2</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-700">{user.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user.role}</p>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors font-medium flex items-center space-x-2"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
