import React, { useState, useEffect } from 'react';
import StudentSidebar from '../components/StudentSidebar';
import { useAuth } from '../context/AuthContext';
import { getStudentRoadmap, updateRoadmapStepStatus } from '../services/apiService';
import { exportToJSON } from '../utils/exportUtils';
import { Map, CheckCircle2, Clock, Circle, ArrowDown, Download } from 'lucide-react';

const MyRoadmapPage = () => {
  const { user } = useAuth();
  const [roadmap, setRoadmap] = useState(null);

  useEffect(() => {
    if (user) {
      const data = getStudentRoadmap(user.id);
      setRoadmap(data);
    }
  }, [user]);

  const handleUpdateStepStatus = (stepId, newStatus) => {
    if (!user) return;
    const res = updateRoadmapStepStatus(user.id, stepId, newStatus);
    if (res) {
      setRoadmap({ ...res.roadmap });
    }
  };

  const completedCount = roadmap?.steps?.filter(s => s.status === 'Completed').length || 0;
  const totalSteps = roadmap?.steps?.length || 10;
  const completionPercent = Math.round((completedCount / totalSteps) * 100);

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <StudentSidebar />

      <main className="flex-grow p-8 overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-slate-200">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Career Milestone Path</span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5">My Learning Roadmap</h1>
            <p className="text-sm text-slate-500 mt-1">
              Target Goal: <strong className="text-blue-700">{roadmap?.careerGoal}</strong>
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <button
              onClick={() => exportToJSON(roadmap, `roadmap_${roadmap?.careerGoal?.replace(/\s+/g, '_')}.json`)}
              className="inline-flex items-center space-x-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold px-4 py-2 rounded-lg transition shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Download Roadmap JSON</span>
            </button>
          </div>
        </div>

        {/* Progress Banner */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs mb-8">
          <div className="flex justify-between items-center mb-2 text-sm font-semibold">
            <span className="text-slate-800">Overall Roadmap Completion</span>
            <span className="text-blue-600">{completionPercent}% ({completedCount}/{totalSteps} Steps)</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-blue-600 h-full rounded-full transition-all duration-500" 
              style={{ width: `${completionPercent}%` }}
            ></div>
          </div>
        </div>

        {/* VISUAL VERTICAL ROADMAP */}
        <div className="max-w-3xl mx-auto space-y-4 relative">
          
          {roadmap?.steps?.map((step, idx) => {
            const isCompleted = step.status === 'Completed';
            const isInProgress = step.status === 'In Progress';

            return (
              <div key={step.id} className="relative">
                
                {/* Connector Arrow */}
                {idx < roadmap.steps.length - 1 && (
                  <div className="absolute left-6 top-14 bottom-0 w-0.5 bg-slate-200 z-0 flex items-center justify-center">
                    <ArrowDown className="w-4 h-4 text-slate-300 translate-y-6" />
                  </div>
                )}

                <div className={`relative z-10 bg-white border rounded-xl p-5 shadow-2xs transition flex items-start space-x-4 ${
                  isCompleted ? 'border-emerald-200 bg-emerald-50/20' : (isInProgress ? 'border-blue-300 ring-2 ring-blue-100' : 'border-slate-200')
                }`}>
                  
                  {/* Status Indicator Icon */}
                  <div className="mt-1">
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                    ) : isInProgress ? (
                      <Clock className="w-6 h-6 text-blue-600 shrink-0 animate-pulse" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-300 shrink-0" />
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="flex-grow">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <h3 className="text-base font-bold text-slate-900">
                        {idx + 1}. {step.name}
                      </h3>
                      
                      {/* Status Dropdown selector */}
                      <select
                        value={step.status}
                        onChange={(e) => handleUpdateStepStatus(step.id, e.target.value)}
                        className={`text-xs font-semibold px-3 py-1 rounded-md border focus:outline-none ${
                          isCompleted ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                          (isInProgress ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-slate-100 text-slate-700 border-slate-300')
                        }`}
                      >
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>

                    <p className="text-slate-600 text-xs mb-3">{step.description}</p>

                    <div className="flex flex-wrap gap-1.5">
                      {step.skills?.map((sk, sIdx) => (
                        <span key={sIdx} className="text-[11px] bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            );
          })}

        </div>

      </main>
    </div>
  );
};

export default MyRoadmapPage;
