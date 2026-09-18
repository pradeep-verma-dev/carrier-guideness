import React, { useState, useEffect } from 'react';
import StudentSidebar from '../components/StudentSidebar';
import { Briefcase, AlertCircle, MapPin, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';

const StudentInternshipsPage = () => {
  const [internships, setInternships] = useState([]);
  const [appliedIds, setAppliedIds] = useState(['int1']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      const response = await fetch('/api/internships');
      const data = await response.json();
      setInternships(data);
    } catch (err) {
      console.error('Error fetching internships:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (id) => {
    if (!appliedIds.includes(id)) {
      setAppliedIds([...appliedIds, id]);
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <StudentSidebar />

      <main className="flex-grow p-8 overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-slate-200">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Practical Industry Exposure</span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5">Internship Opportunities</h1>
            <p className="text-sm text-slate-500 mt-1">
              Apply to project internships to validate core skills.
            </p>
          </div>

          <div className="mt-4 md:mt-0 text-xs text-slate-600 bg-white px-3 py-2 border border-slate-200 rounded-lg">
            Applied: <strong>{appliedIds.length}</strong> Opportunities
          </div>
        </div>

        {/* DEMO OPPORTUNITY ALERT BANNER */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 flex items-start space-x-3 text-amber-900">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <strong className="font-bold text-amber-950 uppercase">DEMO OPPORTUNITY NOTICE:</strong>
            <p className="mt-0.5 leading-relaxed text-amber-800">
              The opportunities listed below are simulated demo positions designed for college project presentation and portfolio tracking purposes.
            </p>
          </div>
        </div>

        {/* INTERNSHIP GRID */}
        {loading ? (
          <div className="text-center py-12 text-slate-500 text-sm">Loading internship listings...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {internships.map((item) => {
              const isApplied = appliedIds.includes(item.id);
              return (
                <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs hover:border-blue-300 transition flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-100 uppercase">
                        DEMO OPPORTUNITY
                      </span>
                      <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {item.mode}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mt-2">{item.role}</h3>
                    <h4 className="text-sm font-semibold text-slate-600 mb-4">{item.company}</h4>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 mb-4">
                      <div className="flex items-center space-x-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.location}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Deadline: {item.deadline}</span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Required Skills</h5>
                      <div className="flex flex-wrap gap-1">
                        {item.requiredSkills?.map((sk, idx) => (
                          <span key={idx} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500">Duration: <strong>{item.duration}</strong></span>

                    <button
                      onClick={() => handleApply(item.id)}
                      disabled={isApplied}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                        isApplied
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {isApplied ? 'Application Submitted' : 'Apply Now'}
                    </button>
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

export default StudentInternshipsPage;
