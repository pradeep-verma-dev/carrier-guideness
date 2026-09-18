import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, Map, Target, BookOpen, Award, Briefcase, 
  GraduationCap, Bot, MessageSquare, LineChart, User, LogOut, Compass, FileText, Menu, X
} from 'lucide-react';

const StudentSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'My Roadmap', path: '/student/roadmap', icon: Map },
    { name: 'My Skills', path: '/student/skills', icon: Target },
    { name: 'Courses', path: '/student/courses', icon: BookOpen },
    { name: 'Certifications', path: '/student/certifications', icon: Award },
    { name: 'Internships', path: '/student/internships', icon: Briefcase },
    { name: 'Competitive Exams', path: '/student/exams', icon: FileText },
    { name: 'Placement Prep', path: '/student/placement', icon: LineChart },
    { name: 'Higher Education', path: '/student/higher-ed', icon: GraduationCap },
    { name: 'AI Career Assistant', path: '/student/ai-assistant', icon: Bot },
    { name: 'Talk to Teacher', path: '/student/teacher-chat', icon: MessageSquare },
    { name: 'Progress', path: '/student/progress', icon: LineChart },
    { name: 'Profile', path: '/student/profile', icon: User },
  ];

  return (
    <>
      {/* Mobile Top Header Bar for Sidebar Toggle */}
      <div className="lg:hidden bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-40 shadow-md w-full">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-sm tracking-tight">Student Portal</span>
        </div>

        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 bg-slate-800 rounded-lg text-slate-200 hover:text-white transition"
          aria-label="Toggle Navigation"
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Backdrop for Mobile */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs"
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed lg:static top-0 left-0 z-50 h-full lg:h-auto w-64 bg-white border-r border-slate-200 
        flex flex-col shrink-0 transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Portal Branding */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 text-white p-2 rounded-lg shadow-2xs">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 leading-tight">Career Roadmap</h2>
              <span className="text-[11px] text-blue-600 font-semibold">Student Portal</span>
            </div>
          </div>
          <button 
            onClick={() => setIsMobileOpen(false)} 
            className="lg:hidden p-1 text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student Badge */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
          <div className="text-xs font-semibold text-slate-900 truncate">{user?.name}</div>
          <div className="text-[11px] text-slate-500 font-mono">{user?.studentId || user?.email}</div>
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
                      ? 'bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-200">
          <button
            onClick={() => { setIsMobileOpen(false); logout(); navigate('/login'); }}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

      </aside>
    </>
  );
};

export default StudentSidebar;
