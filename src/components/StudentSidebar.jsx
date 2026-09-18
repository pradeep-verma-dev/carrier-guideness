import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, Map, Target, BookOpen, Award, Briefcase, 
  GraduationCap, Bot, MessageSquare, LineChart, User, LogOut, Compass, FileText
} from 'lucide-react';

const StudentSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
    <aside className="w-64 bg-white border-r border-slate-200 min-h-screen flex flex-col shrink-0">
      
      {/* Portal Branding */}
      <div className="p-6 border-b border-slate-100 flex items-center space-x-3">
        <div className="bg-blue-600 text-white p-2 rounded-lg shadow-2xs">
          <Compass className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-900 leading-tight">Career Roadmap</h2>
          <span className="text-[11px] text-blue-600 font-semibold">Student Portal</span>
        </div>
      </div>

      {/* Student Badge */}
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
        <div className="text-xs font-semibold text-slate-900 truncate">{user?.name}</div>
        <div className="text-[11px] text-slate-500 font-mono">{user?.studentId || user?.email}</div>
      </div>

      {/* Navigation List */}
      <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
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
          onClick={() => { logout(); navigate('/login'); }}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

    </aside>
  );
};

export default StudentSidebar;
