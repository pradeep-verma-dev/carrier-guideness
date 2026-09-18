import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, Users, LineChart, BarChart3, MessageSquare, 
  FileText, LogOut, Compass, UserCheck, Menu, X
} from 'lucide-react';

const TeacherSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/teacher/dashboard', icon: LayoutDashboard },
    { name: 'Students', path: '/teacher/students', icon: Users },
    { name: 'Career Analytics', path: '/teacher/analytics', icon: BarChart3 },
    { name: 'Messages', path: '/teacher/messages', icon: MessageSquare },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-40 shadow-md w-full">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-sm tracking-tight">Faculty Advisory Portal</span>
        </div>

        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 bg-slate-800 rounded-lg text-slate-200 hover:text-white transition cursor-pointer"
          aria-label="Toggle Navigation"
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Backdrop for Mobile */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs"
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static top-0 left-0 z-50 h-full lg:h-auto w-64 bg-slate-900 text-slate-300 
        flex flex-col shrink-0 transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Branding */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 text-white p-2 rounded-lg shadow-2xs">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white leading-tight">Career Roadmap</h2>
              <span className="text-[11px] text-blue-400 font-semibold">Faculty Advisory Portal</span>
            </div>
          </div>
          <button onClick={() => setIsMobileOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Teacher Profile Badge */}
        <div className="px-6 py-4 bg-slate-950/60 border-b border-slate-800">
          <div className="text-xs font-semibold text-white truncate">{user?.name}</div>
          <div className="text-[11px] text-slate-400">Assigned Section: <strong className="text-blue-400">{user?.section || 'CSE-A'}</strong></div>
        </div>

        {/* Nav list */}
        <nav className="flex-grow p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={() => { setIsMobileOpen(false); logout(); navigate('/login'); }}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-slate-800 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

      </aside>
    </>
  );
};

export default TeacherSidebar;
