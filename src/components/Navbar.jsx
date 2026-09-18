import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, LogIn, LogOut, User, LayoutDashboard, Sparkles, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'student') return '/student/dashboard';
    if (user.role === 'teacher') return '/teacher/dashboard';
    if (user.role === 'admin') return '/admin/dashboard';
    return '/';
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-blue-600 text-white p-2 rounded-lg shadow-xs group-hover:bg-blue-700 transition">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg md:text-xl font-bold text-slate-900 tracking-tight block">
                Career Roadmap Portal
              </span>
              <span className="text-[10px] md:text-xs text-blue-600 font-medium block">
                Educational Success Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-slate-600 hover:text-blue-600 font-medium text-sm transition">
              Home
            </Link>
            <Link to="/career-paths" className="text-slate-600 hover:text-blue-600 font-medium text-sm transition">
              Career Paths
            </Link>
            <Link to="/data-export" className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm transition flex items-center gap-1.5 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Data Upload & Export</span>
            </Link>
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  to={getDashboardPath()}
                  className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 px-4 py-2 rounded-lg font-medium text-sm transition"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center space-x-1.5 text-slate-600 hover:text-red-600 px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium text-sm transition shadow-xs"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top duration-200">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Home
          </Link>
          <Link
            to="/career-paths"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Career Paths
          </Link>
          <Link
            to="/data-export"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100"
          >
            ✨ Data Upload & Export
          </Link>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-2.5 rounded-xl font-medium text-sm shadow-xs"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Go to Dashboard ({user.role})</span>
                </Link>
                <button
                  onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                  className="w-full flex items-center justify-center space-x-2 border border-slate-200 text-red-600 py-2.5 rounded-xl font-medium text-sm hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-2.5 rounded-xl font-medium text-sm"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

