import React, { useState, useEffect } from 'react';
import TeacherSidebar from '../components/TeacherSidebar';
import { useAuth } from '../context/AuthContext';
import { getStorageData, STORAGE_KEYS } from '../services/storageService';
import { exportToJSON } from '../utils/exportUtils';
import { Users, UserCheck, TrendingUp, AlertTriangle, Download, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const students = getStorageData(STORAGE_KEYS.STUDENTS);
    const totalStudents = students.length;
    const activeStudents = Math.round(totalStudents * 0.85);
    const avgReadiness = Math.round(students.reduce((acc, s) => acc + (s.readiness || 0), 0) / (totalStudents || 1));
    const needingGuidance = students.filter(s => (s.readiness || 0) < 50).length;

    setStats({
      totalStudents,
      activeStudents,
      avgReadiness: `${avgReadiness}%`,
      needingGuidance
    });
  }, []);

  const handleDownloadAnalytics = () => {
    exportToJSON(stats, `faculty_overview_analytics.json`);
  };

  return (
    <div className="flex flex-col lg:flex-row bg-slate-50 min-h-screen">
      <TeacherSidebar />

      <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-slate-200">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Faculty Portal</span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5">Faculty Advisory Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">
              Section Advisory: <strong className="text-blue-700">{user?.section || 'CSE-A'}</strong> | Educator: {user?.name}
            </p>
          </div>

          <button
            onClick={handleDownloadAnalytics}
            className="mt-4 md:mt-0 inline-flex items-center space-x-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold px-4 py-2 rounded-lg transition shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Download Analytics (JSON)</span>
          </button>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Total Students</span>
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900">{stats?.totalStudents || 120}</div>
            <p className="text-xs text-slate-500 mt-1">Enrolled across sections</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Active Students</span>
              <UserCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900">{stats?.activeStudents || 96}</div>
            <p className="text-xs text-emerald-600 font-semibold mt-1">80%+ Portal Activity</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Average Readiness</span>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900">{stats?.avgReadiness || '67%'}</div>
            <p className="text-xs text-slate-500 mt-1">Cohort progress score</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Needing Guidance</span>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900">{stats?.needingGuidance || 18}</div>
            <p className="text-xs text-amber-600 font-semibold mt-1">Readiness below 50%</p>
          </div>

        </div>

        {/* QUICK LINK TO STUDENT ROSTER */}
        <div className="bg-blue-600 text-white rounded-xl p-6 flex items-center justify-between shadow-xs">
          <div>
            <h3 className="text-lg font-bold">Monitor Student Progress Roster</h3>
            <p className="text-xs text-blue-100 mt-1">
              View individual student skill profiles, filter section reports, and download CSV performance data.
            </p>
          </div>

          <Link
            to="/teacher/students"
            className="inline-flex items-center space-x-2 bg-white text-blue-700 font-bold px-5 py-2.5 rounded-lg hover:bg-blue-50 transition text-xs shadow-2xs"
          >
            <span>View Students Roster</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

      </main>
    </div>
  );
};

export default TeacherDashboard;
