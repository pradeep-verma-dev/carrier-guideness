import React, { useState, useEffect } from 'react';
import StudentSidebar from '../components/StudentSidebar';
import { Award, ExternalLink, Clock, ShieldCheck, Search } from 'lucide-react';

const StudentCertificationsPage = () => {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completedIds, setCompletedIds] = useState(['cert1', 'cert2']);

  useEffect(() => {
    fetchCerts();
  }, []);

  const fetchCerts = async () => {
    try {
      const response = await fetch('/api/certifications');
      const data = await response.json();
      setCerts(data);
    } catch (err) {
      console.error('Error fetching certifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = (id) => {
    if (completedIds.includes(id)) {
      setCompletedIds(completedIds.filter(cId => cId !== id));
    } else {
      setCompletedIds([...completedIds, id]);
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <StudentSidebar />

      <main className="flex-grow p-8 overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-slate-200">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Industry Accreditation</span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5">Certifications</h1>
            <p className="text-sm text-slate-500 mt-1">
              Top global industry credentials from AWS, Microsoft, Google, Cisco, and CompTIA.
            </p>
          </div>

          <div className="mt-4 md:mt-0 text-xs text-slate-600 bg-white px-3 py-2 border border-slate-200 rounded-lg">
            Earned: <strong>{completedIds.length}</strong> / {certs.length}
          </div>
        </div>

        {/* CERTIFICATIONS GRID */}
        {loading ? (
          <div className="text-center py-12 text-slate-500 text-sm">Loading certifications...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certs.map((cert) => {
              const isDone = completedIds.includes(cert.id);
              return (
                <div key={cert.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs hover:border-blue-300 transition flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded">
                        {cert.provider}
                      </span>
                      <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        {cert.difficulty}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mb-2">{cert.name}</h3>

                    <div className="flex items-center space-x-2 text-xs text-slate-500 mb-6">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{cert.duration}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <a
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                    >
                      <span>Official Guide</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      onClick={() => toggleComplete(cert.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        isDone
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {isDone ? 'Mark Complete' : 'Start Preparation'}
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

export default StudentCertificationsPage;
