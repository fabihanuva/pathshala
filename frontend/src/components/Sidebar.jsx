import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = {
  student: [
    { to: '/dashboard', label: 'Dashboard', icon: '⬛' },
    { to: '/courses', label: 'Courses', icon: '📖' },
    { to: '/profile', label: 'Profile', icon: '👤' },
  ],
  instructor: [
    { to: '/dashboard', label: 'Dashboard', icon: '⬛' },
    { to: '/courses', label: 'Courses', icon: '📖' },
    { to: '/profile', label: 'Profile', icon: '👤' },
  ],
  admin: [
    { to: '/dashboard', label: 'Dashboard', icon: '⬛' },
    { to: '/courses', label: 'Courses', icon: '📖' },
    { to: '/admin/users', label: 'Users', icon: '👥' },
    { to: '/profile', label: 'Profile', icon: '👤' },
  ],
};

const PORTAL_LABEL = {
  student: 'Student Portal',
  instructor: 'Teacher Portal',
  admin: 'Admin Console',
};

const Sidebar = () => {
  const { user } = useAuth();
  const items = NAV_ITEMS[user?.role] || NAV_ITEMS.student;

  return (
    <aside className="hidden md:flex md:flex-col w-64 shrink-0 bg-ink-900 text-white min-h-screen sticky top-0">
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-2 font-heading font-bold text-lg">
          <span className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-sm">P</span>
          Pathshala
        </div>
        <p className="text-xs text-slate-400 mt-1 uppercase tracking-wide">
          {PORTAL_LABEL[user?.role] || 'Portal'}
        </p>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1">
        <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Menu</p>
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive ? 'bg-brand-500 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <span>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mx-3 mb-4 rounded-xl bg-white/5 border border-white/10">
        <p className="text-xs text-slate-300">Logged in as</p>
        <p className="text-sm font-medium truncate">{user?.name}</p>
      </div>
    </aside>
  );
};

export default Sidebar;
