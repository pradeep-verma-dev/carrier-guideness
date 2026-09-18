import React, { useState, useEffect } from 'react';
import StudentSidebar from '../components/StudentSidebar';
import { LineChart, CheckCircle2, Clock, Code, FileText, Users, Award } from 'lucide-react';

const StudentPlacementPrepPage = () => {
  const [placementData, setPlacementData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlacementData();
  }, []);

  const fetchPlacementData = async () => {
    try {
      const response = await fetch('/api/placement');
      const data = await response.json();
      setPlacementData(data);
    } catch (err) {
      console.error('Error fetching placement prep:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleItemComplete = (id) => {
    setPlacementData(placementData.map(item => {
      if (item.id === id) {
        return { ...item, completed: !item.completed };
      }
      return item;
    }));
  };

  const categories = ['Aptitude', 'Logical Reasoning', 'Verbal Ability', 'Coding', 'Technical Interview', 'HR Interview', 'Resume', 'Group Discussion'];

  const completedCount = placementData.filter(i => i.completed).length;
  const overallPercent = Math.round((completedCount / (placementData.length || 1)) * 100);

  return (
    <div className="flex flex-col lg:flex-row bg-slate-50 min-h-screen">
      <StudentSidebar />

      <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-slate-200">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Campus Recruitment Prep</span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5">Placement Preparation</h1>
            <p className="text-sm text-slate-500 mt-1">
              Structured preparation across Aptitude, Coding, Technical & HR interviews.
            </p>
          </div>
        </div>

        {/* Overall Progress Banner */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs mb-8">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-bold text-slate-900">Placement Preparation Score</h3>
            <span className="text-sm font-bold text-emerald-600">{overallPercent}% ({completedCount}/{placementData.length} Topics Completed)</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${overallPercent}%` }}
            ></div>
          </div>
        </div>

        {/* CATEGORY MODULE CARDS */}
        {loading ? (
          <div className="text-center py-12 text-slate-500 text-sm">Loading placement preparation modules...</div>
        ) : (
          <div className="space-y-8">
            {categories.map((cat, idx) => {
              const catItems = placementData.filter(i => i.category === cat);
              if (catItems.length === 0) return null;

              return (
                <div key={idx} className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
                  <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    <span>{cat} Preparation Modules</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {catItems.map((item) => (
                      <div 
                        key={item.id} 
                        className={`p-4 rounded-lg border transition flex items-start justify-between gap-3 ${
                          item.completed ? 'bg-emerald-50/40 border-emerald-200' : 'bg-slate-50/60 border-slate-200'
                        }`}
                      >
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                          <p className="text-xs text-slate-500 mt-0.5">Topic: {item.topic}</p>
                          <span className="inline-block text-[10px] bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded font-mono mt-2">
                            {item.difficulty} Difficulty
                          </span>
                        </div>

                        <button
                          onClick={() => toggleItemComplete(item.id)}
                          className={`px-3 py-1 rounded text-xs font-semibold shrink-0 transition ${
                            item.completed 
                              ? 'bg-emerald-600 text-white' 
                              : 'bg-white hover:bg-slate-100 border border-slate-300 text-slate-700'
                          }`}
                        >
                          {item.completed ? 'Completed' : 'Mark Done'}
                        </button>
                      </div>
                    ))}
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

export default StudentPlacementPrepPage;
