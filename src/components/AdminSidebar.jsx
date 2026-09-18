import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, Users, UserCheck, BookOpen, Award, Briefcase, 
  FileText, GraduationCap, LineChart, Download, LogOut, Compass, Shield
} from 'lucide-react';

const AdminSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
    <aside className="w-64 bg-slate-950 text-slate-300 min-h-screen flex flex-col shrink-0">
      
      {/* Branding */}
      <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
        <div className="bg-blue-600 text-white p-2 rounded-lg shadow-2xs">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-white leading-tight">Career Roadmap</h2>
          <span className="text-[11px] text-blue-400 font-semibold">Central Admin Portal</span>
        </div>
      </div>

      {/* Admin Profile */}
      <div className="px-6 py-4 bg-slate-900 border-b border-slate-800">
        <div className="text-xs font-semibold text-white truncate">{user?.name}</div>
        <div className="text-[11px] text-slate-400 font-mono">Role: Central Administrator</div>
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
          onClick={() => { logout(); navigate('/login'); }}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-slate-900 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

    </aside>
  );
};

export default AdminSidebar;
