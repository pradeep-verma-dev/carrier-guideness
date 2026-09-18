import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, Users, UserCheck, BookOpen, Award, Briefcase, 
  FileText, GraduationCap, LineChart, Download, LogOut, Compass, Shield, Menu, X
} from 'lucide-react';

const AdminSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Students', path: '/admin/students', icon: Users },
    { name: 'Teachers', path: '/admin/teachers', icon: UserCheck },
    { name: 'Courses', path: '/admin/courses', icon: BookOpen },
    { name: 'Certifications', path: '/admin/certifications', icon: Award },
    { name: 'Internships', path: '/admin/internships', icon: Briefcase },
    { name: 'Exams', path: '/admin/exams', icon: FileText },
    { name: 'Placement Resources', path: '/admin/placement', icon: LineChart },
    { name: 'Higher Education', path: '/admin/higher-ed', icon: GraduationCap },
    { name: 'Platform Reports', path: '/admin/reports', icon: Download },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden bg-slate-950 text-white p-4 flex items-center justify-between sticky top-0 z-40 shadow-md w-full">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-sm tracking-tight">Central Admin Portal</span>
        </div>

        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 bg-slate-900 rounded-lg text-slate-200 hover:text-white transition cursor-pointer"
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
        fixed lg:static top-0 left-0 z-50 h-full lg:h-auto w-64 bg-slate-950 text-slate-300 
        flex flex-col shrink-0 transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Branding */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 text-white p-2 rounded-lg shadow-2xs">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white leading-tight">Career Roadmap</h2>
              <span className="text-[11px] text-blue-400 font-semibold">Central Admin Portal</span>
            </div>
          </div>
          <button onClick={() => setIsMobileOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin Profile */}
        <div className="px-6 py-4 bg-slate-900 border-b border-slate-800">
          <div className="text-xs font-semibold text-white truncate">{user?.name}</div>
          <div className="text-[11px] text-slate-400 font-mono">Role: Central Administrator</div>
        </div>

        {/* Navigation List */}
        <nav className="flex-grow p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-200px)]">
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
                      : 'text-slate-400 hover:bg-slate-900 hover:text-white'
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
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-slate-900 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

      </aside>
    </>
  );
};

export default AdminSidebar;
