import React, { useState, useEffect } from 'react';
import TeacherSidebar from '../components/TeacherSidebar';
import { useAuth } from '../context/AuthContext';
import { getStorageData, STORAGE_KEYS } from '../services/storageService';
import { exportToJSON } from '../utils/exportUtils';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid 
} from 'recharts';
import { BarChart3, TrendingUp, Target, Download } from 'lucide-react';

const TeacherAnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const students = getStorageData(STORAGE_KEYS.STUDENTS);
    
    // Career distribution
    const careerMap = {};
    students.forEach(s => {
      const goal = s.careerGoal || 'Unassigned';
      careerMap[goal] = (careerMap[goal] || 0) + 1;
    });
    const careerPathsDistribution = Object.keys(careerMap).map(k => ({ name: k, count: careerMap[k] }));

    // Skill Gaps
    const gapMap = {};
    students.forEach(s => {
      (s.skillGaps || []).forEach(gap => {
        gapMap[gap] = (gapMap[gap] || 0) + 1;
      });
    });
    const commonSkillGaps = Object.keys(gapMap).map(k => ({ skill: k, count: gapMap[k] })).sort((a,b) => b.count - a.count).slice(0, 8);

    // Readiness Bins
    const readinessBins = [
      { range: '0-40% (High Risk)', count: students.filter(s => s.readiness < 40).length },
      { range: '41-60% (Moderate)', count: students.filter(s => s.readiness >= 41 && s.readiness <= 60).length },
      { range: '61-80% (On Track)', count: students.filter(s => s.readiness >= 61 && s.readiness <= 80).length },
      { range: '81-100% (Job Ready)', count: students.filter(s => s.readiness > 80).length }
    ];

    setAnalytics({
      careerPathsDistribution,
      commonSkillGaps,
      readinessBins
    });
  }, []);

  return (
    <div className="flex flex-col lg:flex-row bg-slate-50 min-h-screen">
      <TeacherSidebar />

      <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-slate-200">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Cohort Metrics</span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5">Career Analytics</h1>
            <p className="text-sm text-slate-500 mt-1">
              Visual analytics covering career paths, skill gaps, and readiness bins.
            </p>
          </div>

          <button
            onClick={() => exportToJSON(analytics, 'faculty_career_analytics.json')}
            className="mt-4 md:mt-0 inline-flex items-center space-x-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold px-4 py-2 rounded-lg transition shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Export Analytics JSON</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* POPULAR CAREER PATHS BAR CHART */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <span>Most Selected Career Paths</span>
            </h3>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics?.careerPathsDistribution || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* READINESS BINS DISTRIBUTION */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span>Career Readiness Cohort Bins</span>
            </h3>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics?.readinessBins || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="range" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* COMMON SKILL GAPS TABLE */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <Target className="w-5 h-5 text-blue-600" />
              <span>Identified Common Skill Gaps Frequency</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {analytics?.commonSkillGaps?.map((gap, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-xs font-bold text-slate-900 block mb-1">{gap.skill}</span>
                  <span className="text-xs text-blue-700 font-bold">{gap.count} Students Need Improvement</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </main>
    </div>
  );
};

export default TeacherAnalyticsPage;
