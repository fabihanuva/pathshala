import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Topbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/courses?search=${encodeURIComponent(search.trim())}`);
    }
  };

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header className="bg-white border-b border-slate-100 px-4 md:px-8 py-4 flex items-center gap-4 sticky top-0 z-20">
      <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search courses, lessons..."
          className="w-full border border-slate-200 bg-cream-50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </form>

      <div className="flex-1" />

      <button
        aria-label="Notifications"
        className="w-9 h-9 rounded-full bg-cream-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
      >
        🔔
      </button>

      <div className="flex items-center gap-3">
        <span className="w-9 h-9 rounded-full bg-brand-50 text-brand-700 font-semibold text-sm flex items-center justify-center">
          {initials}
        </span>
        <div className="hidden sm:block">
          <p className="text-sm font-medium text-slate-800 leading-tight">{user?.name}</p>
          <p className="text-xs text-slate-500 capitalize leading-tight">{user?.role}</p>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="text-sm font-medium text-red-600 hover:text-red-700 border border-red-100 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
      >
        Log out
      </button>
    </header>
  );
};

export default Topbar;
