import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { useAuth } from '../context/AuthContext';
import { getStorageData, STORAGE_KEYS } from '../services/storageService';
import { exportToJSON } from '../utils/exportUtils';
import { Users, UserCheck, BookOpen, Award, Briefcase, FileText, Download } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const students = getStorageData(STORAGE_KEYS.STUDENTS);
    const teachers = getStorageData(STORAGE_KEYS.TEACHERS);
    const courses = getStorageData(STORAGE_KEYS.COURSES);
    const certs = getStorageData(STORAGE_KEYS.CERTS);
    const internships = getStorageData(STORAGE_KEYS.INTERNSHIPS);
    const exams = getStorageData(STORAGE_KEYS.EXAMS);

    setStats({
      students: students.length,
      teachers: teachers.length,
      courses: courses.length,
      certifications: certs.length,
      internships: internships.length,
      exams: exams.length
    });
  }, []);

  const handleDownloadFullPlatformReport = () => {
    const students = getStorageData(STORAGE_KEYS.STUDENTS);
    const teachers = getStorageData(STORAGE_KEYS.TEACHERS);
    const courses = getStorageData(STORAGE_KEYS.COURSES);
    const certs = getStorageData(STORAGE_KEYS.CERTS);
    const internships = getStorageData(STORAGE_KEYS.INTERNSHIPS);

    const platformData = {
      generatedAt: new Date().toISOString(),
      students,
      teachers,
      courses,
      certifications: certs,
      internships
    };
    exportToJSON(platformData, 'platform_master_report.json');
  };

  return (
    <div className="flex flex-col lg:flex-row bg-slate-50 min-h-screen">
      <AdminSidebar />

      <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-slate-200">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">System Administration</span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5">Admin Central Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage platform datasets, courses, certifications, internships, and platform exports.
            </p>
          </div>

          <button
            onClick={handleDownloadFullPlatformReport}
            className="mt-4 md:mt-0 inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-lg transition shadow-2xs"
          >
            <Download className="w-4 h-4" />
            <span>DOWNLOAD MASTER PLATFORM REPORT (JSON)</span>
          </button>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Registered Students</span>
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900">{stats?.students || 20}</div>
            <p className="text-xs text-slate-500 mt-1">Active student profiles</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Faculty Mentors</span>
              <UserCheck className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900">{stats?.teachers || 5}</div>
            <p className="text-xs text-slate-500 mt-1">Assigned section educators</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Catalog Courses</span>
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900">{stats?.courses || 15}</div>
            <p className="text-xs text-slate-500 mt-1">Curated course modules</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Certifications</span>
              <Award className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900">{stats?.certifications || 10}</div>
            <p className="text-xs text-slate-500 mt-1">Global accreditation paths</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Demo Internships</span>
              <Briefcase className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900">{stats?.internships || 10}</div>
            <p className="text-xs text-slate-500 mt-1">Simulated opportunity listings</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Competitive Exams</span>
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900">{stats?.exams || 8}</div>
            <p className="text-xs text-slate-500 mt-1">GATE, CAT, GRE, UPSC guides</p>
          </div>

        </div>

      </main>
    </div>
  );
};

export default AdminDashboard;
