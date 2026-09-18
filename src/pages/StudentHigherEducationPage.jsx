import React, { useState, useEffect } from 'react';
import StudentSidebar from '../components/StudentSidebar';
import { GraduationCap, BookOpen, ExternalLink, Globe, Award } from 'lucide-react';

const StudentHigherEducationPage = () => {
  const [higherEd, setHigherEd] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHigherEd();
  }, []);

  const fetchHigherEd = async () => {
    try {
      const response = await fetch('/api/higher-education');
      const data = await response.json();
      setHigherEd(data);
    } catch (err) {
      console.error('Error fetching higher education options:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row bg-slate-50 min-h-screen">
      <StudentSidebar />

      <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-slate-200">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Post-Graduate Advisory</span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5">Higher Education & Research</h1>
            <p className="text-sm text-slate-500 mt-1">
              Explore M.Tech, MBA, MS abroad, MCA, PhD, Central Universities, and Study Abroad programs.
            </p>
          </div>
        </div>

        {/* PROGRAM GRID */}
        {loading ? (
          <div className="text-center py-12 text-slate-500 text-sm">Loading post-graduate programs...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {higherEd.map((item) => (
              <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs hover:border-blue-300 transition flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-100">
                      {item.category}
                    </span>
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-mono">
                      {item.entranceExam}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mt-2 mb-2">{item.program}</h3>
                  <p className="text-xs text-slate-500 mb-4">
                    Eligibility: <strong>{item.eligibility}</strong>
                  </p>

                  <div className="mb-4">
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Key Technical Prerequisites</h4>
                    <div className="flex flex-wrap gap-1">
                      {item.requiredSkills?.map((sk, idx) => (
                        <span key={idx} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Official Portals & Resources</h4>
                  <div className="flex flex-wrap gap-2 text-xs text-blue-600 font-semibold">
                    {item.resources?.map((res, idx) => (
                      <span key={idx} className="flex items-center space-x-1 bg-blue-50 px-2 py-1 rounded">
                        <span>{res}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
};

export default StudentHigherEducationPage;
