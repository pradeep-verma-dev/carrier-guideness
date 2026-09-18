import React, { useState, useEffect } from 'react';
import TeacherSidebar from '../components/TeacherSidebar';
import { useAuth } from '../context/AuthContext';
import { getStorageData, STORAGE_KEYS } from '../services/storageService';
import { exportToCSV, exportToJSON } from '../utils/exportUtils';
import { Search, Download, Eye } from 'lucide-react';

const TeacherStudentsPage = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState('All');
  const [selectedCareer, setSelectedCareer] = useState('All');
  const [readinessFilter, setReadinessFilter] = useState('All');
  const [selectedStudentReport, setSelectedStudentReport] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    const data = getStorageData(STORAGE_KEYS.STUDENTS);
    setStudents(data);
  };

  const sections = ['All', ...new Set(students.map(s => s.section || 'Unassigned'))];
  const careers = ['All', ...new Set(students.map(s => s.careerGoal || 'Unassigned'))];

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSection = selectedSection === 'All' || s.section === selectedSection;
    const matchesCareer = selectedCareer === 'All' || s.careerGoal === selectedCareer;

    let matchesReadiness = true;
    if (readinessFilter === 'below50') matchesReadiness = s.readiness < 50;
    else if (readinessFilter === '50to75') matchesReadiness = s.readiness >= 50 && s.readiness <= 75;
    else if (readinessFilter === 'above75') matchesReadiness = s.readiness > 75;

    return matchesSearch && matchesSection && matchesCareer && matchesReadiness;
  });

  const handleDownloadFilteredReport = () => {
    if (filteredStudents.length === 0) {
      alert('No student records match the selected filters.');
      return;
    }

    const csvData = filteredStudents.map(s => ({
      'Student ID': s.studentId,
      'Student Name': s.name,
      'Email': s.email,
      'Section': s.section,
      'Year': s.year,
      'Career Goal': s.careerGoal,
      'Readiness Score (%)': s.readiness,
      'Courses Completed': s.completedCoursesCount,
      'Certifications Earned': s.certificationsCount,
      'Placement Prep (%)': s.placementPrepProgress,
      'Skill Gaps': s.skillGaps?.join('; ')
    }));

    exportToCSV(csvData, `filtered_student_report_${selectedSection}_${selectedCareer.replace(/\s+/g, '_')}.csv`);
  };

  const handleViewIndividualReport = (student) => {
    const roadmaps = getStorageData(STORAGE_KEYS.ROADMAPS);
    const studentRoadmap = roadmaps.find(r => r.studentId === student.id);

    setSelectedStudentReport({
      student,
      careerReadiness: student.readiness,
      skillGaps: student.skillGaps || [],
      roadmap: studentRoadmap ? studentRoadmap.steps : []
    });
  };

  return (
    <div className="flex flex-col lg:flex-row bg-slate-50 min-h-screen">
      <TeacherSidebar />

      <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-slate-200">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Student Roster Advisory</span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5">Student Progress Monitoring</h1>
            <p className="text-sm text-slate-500 mt-1">
              Filter student cohorts by Section, Career Path, or Readiness level.
            </p>
          </div>

          <button
            onClick={handleDownloadFilteredReport}
            className="mt-4 md:mt-0 inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-lg transition shadow-2xs"
          >
            <Download className="w-4 h-4" />
            <span>DOWNLOAD FILTERED REPORT (CSV)</span>
          </button>
        </div>

        {/* FILTERS BAR */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs mb-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Search Student</label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Section Filter</label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700 font-medium focus:outline-none"
              >
                {sections.map((sec, idx) => (
                  <option key={idx} value={sec}>{sec}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Career Goal Filter</label>
              <select
                value={selectedCareer}
                onChange={(e) => setSelectedCareer(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700 font-medium focus:outline-none"
              >
                {careers.map((car, idx) => (
                  <option key={idx} value={car}>{car}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Readiness Level</label>
              <select
                value={readinessFilter}
                onChange={(e) => setReadinessFilter(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700 font-medium focus:outline-none"
              >
                <option value="All">All Levels</option>
                <option value="below50">Below 50% (Needing Guidance)</option>
                <option value="50to75">50% - 75% (Moderate Progress)</option>
                <option value="above75">Above 75% (Job Ready)</option>
              </select>
            </div>

          </div>

          <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>Showing <strong>{filteredStudents.length}</strong> of {students.length} students</span>
          </div>
        </div>

        {/* STUDENTS TABLE */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Student ID</th>
                  <th className="py-3.5 px-4">Name</th>
                  <th className="py-3.5 px-4">Section</th>
                  <th className="py-3.5 px-4">Career Goal</th>
                  <th className="py-3.5 px-4">Readiness</th>
                  <th className="py-3.5 px-4">Courses</th>
                  <th className="py-3.5 px-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-mono text-slate-700">{s.studentId}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{s.name}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-600">{s.section}</td>
                    <td className="py-3.5 px-4 text-blue-700 font-medium">{s.careerGoal}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        s.readiness >= 75 ? 'bg-emerald-100 text-emerald-800' :
                        (s.readiness >= 50 ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800')
                      }`}>
                        {s.readiness}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{s.completedCoursesCount} completed</td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleViewIndividualReport(s)}
                        className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Report</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* INDIVIDUAL STUDENT REPORT MODAL */}
        {selectedStudentReport && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto shadow-xl space-y-6">
              
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Individual Performance Report</span>
                  <h3 className="text-xl font-bold text-slate-900">{selectedStudentReport.student.name}</h3>
                  <p className="text-xs text-slate-500">ID: {selectedStudentReport.student.studentId} | Section: {selectedStudentReport.student.section}</p>
                </div>
                <button
                  onClick={() => setSelectedStudentReport(null)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <span className="text-slate-500 uppercase font-bold block mb-1">Career Goal</span>
                  <span className="text-blue-700 font-bold">{selectedStudentReport.student.careerGoal}</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <span className="text-slate-500 uppercase font-bold block mb-1">Readiness Score</span>
                  <span className="text-emerald-600 font-extrabold text-base">{selectedStudentReport.careerReadiness}%</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Skill Gap Analysis</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedStudentReport.skillGaps.map((gap, gIdx) => (
                    <span key={gIdx} className="bg-amber-50 border border-amber-200 text-amber-800 text-xs px-2.5 py-1 rounded font-semibold">
                      {gap}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end space-x-3">
                <button
                  onClick={() => exportToJSON(selectedStudentReport, `report_${selectedStudentReport.student.studentId}.json`)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg"
                >
                  Download JSON Report
                </button>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default TeacherStudentsPage;
