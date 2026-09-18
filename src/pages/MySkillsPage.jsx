import React, { useState, useEffect } from 'react';
import StudentSidebar from '../components/StudentSidebar';
import { useAuth } from '../context/AuthContext';
import { getStudentProfile, updateSkillProgress } from '../services/apiService';
import { exportToCSV } from '../utils/exportUtils';
import { Target, AlertTriangle, Download } from 'lucide-react';

const MySkillsPage = () => {
  const { user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [skillGaps, setSkillGaps] = useState([]);

  useEffect(() => {
    if (user) {
      const profile = getStudentProfile(user.id);
      if (profile) {
        setSkills(profile.skills || []);
        setSkillGaps(profile.skillGaps || []);
      }
    }
  }, [user]);

  const handleUpdateSkillProgress = (skillName, newProgress) => {
    if (!user) return;
    const updated = updateSkillProgress(user.id, skillName, newProgress);
    setSkills([...updated]);
  };

  const handleExportSkillReport = () => {
    const csvRows = [
      ...skills.map(s => ({ Type: 'Mastered Skill', Skill: s.name, Level: s.level, Progress: `${s.progress}%` })),
      ...skillGaps.map(g => ({ Type: 'Skill Gap', Skill: g, Level: 'Gap Identified', Progress: '0%' }))
    ];
    exportToCSV(csvRows, 'skill_gap_report.csv');
  };

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <StudentSidebar />

      <main className="flex-grow p-8 overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-slate-200">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Competency & Gap Analysis</span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5">My Skills & Gap Inventory</h1>
            <p className="text-sm text-slate-500 mt-1">
              Track proficiency levels and identify target focus areas.
            </p>
          </div>

          <button
            onClick={handleExportSkillReport}
            className="mt-4 md:mt-0 inline-flex items-center space-x-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold px-4 py-2 rounded-lg transition shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Download Skill Report (CSV)</span>
          </button>
        </div>

        {/* SKILLS LIST & PROGRESS UPDATER */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center space-x-2">
              <Target className="w-5 h-5 text-blue-600" />
              <span>Tracked Skills & Proficiency</span>
            </h2>

            {skills.map((skill, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{skill.name}</h4>
                    <span className="text-xs text-slate-500">{skill.level}</span>
                  </div>
                  <span className="text-sm font-extrabold text-blue-600">{skill.progress}%</span>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex-grow bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-blue-600 h-full rounded-full transition-all duration-300" 
                      style={{ width: `${skill.progress}%` }}
                    ></div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={skill.progress}
                    onChange={(e) => handleUpdateSkillProgress(skill.name, e.target.value)}
                    className="w-28 cursor-pointer accent-blue-600"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* SKILL GAPS ALERT BOX */}
          <div className="bg-white border border-blue-200 rounded-xl p-6 shadow-2xs self-start">
            <div className="flex items-center space-x-2 text-blue-900 font-bold mb-3">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span>Identified Skill Gaps</span>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              These technical competencies are crucial for your target career but need focused learning attention:
            </p>

            <div className="space-y-2.5 mb-6">
              {skillGaps.map((gap, gIdx) => (
                <div key={gIdx} className="p-3 bg-amber-50/60 border border-amber-200 rounded-lg flex items-center justify-between text-xs font-semibold text-slate-800">
                  <span>{gap}</span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-mono">Priority</span>
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
              <h5 className="font-bold text-slate-900 mb-1">Recommended Action:</h5>
              Visit the <strong>Courses</strong> or <strong>Certifications</strong> tab to enroll in modules matching these gaps.
            </div>
          </div>

        </div>

      </main>
    </div>
  );
};

export default MySkillsPage;
