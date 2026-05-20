import React from 'react';
import { Bell, Menu, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const pageTitles = {
  '/admin/dashboard': 'Dashboard',
  '/admin/contacts': 'Contacts',
  '/admin/consultations': 'Consultations',
  '/admin/settings': 'Settings',
};

const Header = ({ onMenuClick }) => {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const title = pageTitles[pathname] || 'Admin Panel';

  return (
    <header className="h-16 bg-neutral-900/50 border-b border-white/10 flex items-center justify-between px-4 sm:px-8 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-all"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-neutral-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
          <div className="w-8 h-8 rounded-full bg-red-600/20 flex items-center justify-center">
            <User className="w-4 h-4 text-red-500" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-white">{user?.name || 'Admin'}</p>
            <p className="text-xs text-neutral-500">{user?.email}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
