import React from 'react';
import { Bell, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const pageTitles = {
  '/admin/dashboard': 'Dashboard',
  '/admin/contacts': 'Contacts',
  '/admin/consultations': 'Consultations',
  '/admin/settings': 'Settings',
};

const Header = () => {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const title = pageTitles[pathname] || 'Admin Panel';

  return (
    <header className="h-16 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between px-8 backdrop-blur-sm">
      <h2 className="text-lg font-semibold text-white">{title}</h2>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-sky-400 rounded-full" />
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-sky-500/10 flex items-center justify-center">
            <User className="w-4 h-4 text-sky-400" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-white">{user?.name || 'Admin'}</p>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
