import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-ink-900 text-white sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="font-heading font-bold text-lg flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-sm">P</span>
          Pathshala
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm text-slate-300">
          <Link to="/courses" className="hover:text-white transition-colors">Courses</Link>
          {user && <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/profile" className="hidden sm:block text-sm text-slate-300 hover:text-white transition-colors">
                {user.name}
              </Link>
              <button
                onClick={handleLogout}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-slate-300 hover:text-white transition-colors">
                Log in
              </Link>
              <Link
                to="/register"
                className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
