import React, { useState, useEffect } from 'react';
import StudentSidebar from '../components/StudentSidebar';
import { FileText, Calendar, BookOpen, CheckCircle, TrendingUp } from 'lucide-react';

const StudentExamsPage = () => {
  const [exams, setExams] = useState([]);
  const [prepScores, setPrepScores] = useState({ ex1: 65, ex2: 40 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await fetch('/api/exams');
      const data = await response.json();
      setExams(data);
    } catch (err) {
      console.error('Error fetching exams:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePrep = (id, newScore) => {
    setPrepScores({ ...prepScores, [id]: Number(newScore) });
  };

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <StudentSidebar />

      <main className="flex-grow p-8 overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-slate-200">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Competitive Entrance Guidance</span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5">Competitive Exams</h1>
            <p className="text-sm text-slate-500 mt-1">
              Track prep milestones for GATE, CAT, UPSC, SSC, Banking, GRE, and CUET-PG.
            </p>
          </div>
        </div>

        {/* EXAMS LIST */}
        {loading ? (
          <div className="text-center py-12 text-slate-500 text-sm">Loading competitive exam information...</div>
        ) : (
          <div className="space-y-6">
            {exams.map((exam) => {
              const currentPrep = prepScores[exam.id] || 0;
              return (
                <div key={exam.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-100">
                          {exam.category}
                        </span>
                        <h3 className="text-lg font-bold text-slate-900">{exam.name}</h3>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Eligibility: <strong>{exam.eligibility}</strong> | Timeline: <strong>{exam.dates}</strong>
                      </p>
                    </div>

                    {/* Progress Slider */}
                    <div className="w-full md:w-64 bg-slate-50 border border-slate-200 p-3 rounded-lg">
                      <div className="flex justify-between items-center text-xs font-bold mb-1">
                        <span className="text-slate-700">Prep Progress</span>
                        <span className="text-blue-600">{currentPrep}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={currentPrep}
                        onChange={(e) => handleUpdatePrep(exam.id, e.target.value)}
                        className="w-full cursor-pointer accent-blue-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <h4 className="font-bold text-slate-700 uppercase tracking-wider mb-2">Syllabus & Subjects</h4>
                      <div className="flex flex-wrap gap-1">
                        {exam.subjects?.map((sub, idx) => (
                          <span key={idx} className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded">
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-700 uppercase tracking-wider mb-2">Preparation Resources</h4>
                      <div className="flex flex-wrap gap-1">
                        {exam.resources?.map((res, idx) => (
                          <span key={idx} className="bg-blue-50 text-blue-800 px-2.5 py-1 rounded">
                            {res}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </main>
    </div>
  );
};

export default StudentExamsPage;
