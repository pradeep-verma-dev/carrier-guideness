import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { getStorageData, STORAGE_KEYS } from '../services/storageService';
import { exportToCSV, exportToJSON } from '../utils/exportUtils';
import { Download, Users, FileText } from 'lucide-react';

const AdminReportsPage = () => {
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    setStudents(getStorageData(STORAGE_KEYS.STUDENTS));
    setTeachers(getStorageData(STORAGE_KEYS.TEACHERS));
  }, []);

  const handleDownloadStudentsCSV = () => {
    const csvRows = students.map(s => ({
      'ID': s.id,
      'Student ID': s.studentId,
      'Name': s.name,
      'Email': s.email,
      'Section': s.section,
      'Year': s.year,
      'Career Goal': s.careerGoal,
      'Readiness Score (%)': s.readiness,
      'Courses Completed': s.completedCoursesCount,
      'Certifications Earned': s.certificationsCount
    }));
    exportToCSV(csvRows, 'platform_students_master.csv');
  };

  const handleDownloadTeachersCSV = () => {
    exportToCSV(teachers, 'platform_teachers_master.csv');
  };

  const handleDownloadMasterJSON = () => {
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
    exportToJSON(platformData, 'platform_full_master_export.json');
  };

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <AdminSidebar />

      <main className="flex-grow p-8 overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-slate-200">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Institution Reporting Hub</span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5">Platform Reports & Exports</h1>
            <p className="text-sm text-slate-500 mt-1">
              Generate and download complete CSV and JSON datasets across all modules.
            </p>
          </div>

          <button
            onClick={handleDownloadMasterJSON}
            className="mt-4 md:mt-0 inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-lg transition shadow-2xs"
          >
            <Download className="w-4 h-4" />
            <span>EXPORT FULL MASTER JSON</span>
          </button>
        </div>

        {/* REPORT DOWNLOAD CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Student Profiles & Readiness Dataset</h3>
                  <span className="text-xs text-slate-500">{students.length} Student Records</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 mb-6">
                Includes complete student identifiers, assigned sections, target career goals, readiness scores, and skill gap lists.
              </p>
            </div>
            <button
              onClick={handleDownloadStudentsCSV}
              className="w-full inline-flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2.5 rounded-lg"
            >
              <Download className="w-4 h-4" />
              <span>Download Students CSV</span>
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Faculty Advisory Dataset</h3>
                  <span className="text-xs text-slate-500">{teachers.length} Faculty Records</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 mb-6">
                Includes educator profiles, assigned engineering sections, departments, and designations.
              </p>
            </div>
            <button
              onClick={handleDownloadTeachersCSV}
              className="w-full inline-flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2.5 rounded-lg"
            >
              <Download className="w-4 h-4" />
              <span>Download Teachers CSV</span>
            </button>
          </div>

        </div>

      </main>
    </div>
  );
};

export default AdminReportsPage;
