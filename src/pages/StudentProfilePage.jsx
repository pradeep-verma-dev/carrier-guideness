import React, { useState, useEffect } from 'react';
import StudentSidebar from '../components/StudentSidebar';
import { useAuth } from '../context/AuthContext';
import { exportToJSON } from '../utils/exportUtils';
import { User, Mail, ShieldCheck, MapPin, Award, BookOpen, Download, Compass } from 'lucide-react';

const StudentProfilePage = () => {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/student/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setProfile(data);
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row bg-slate-50 min-h-screen">
      <StudentSidebar />

      <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-slate-200">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Account Settings</span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5">Student Profile</h1>
            <p className="text-sm text-slate-500 mt-1">
              Academic credentials and career goals registered on platform.
            </p>
          </div>

          <button
            onClick={() => exportToJSON(profile, `student_profile_${user.name.replace(/\s+/g, '_')}.json`)}
            className="mt-4 md:mt-0 inline-flex items-center space-x-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold px-4 py-2 rounded-lg transition shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Export Profile JSON</span>
          </button>
        </div>

        {/* PROFILE CARD */}
        <div className="bg-white border border-slate-200 rounded-xl p-8 max-w-2xl shadow-2xs space-y-6">
          
          <div className="flex items-center space-x-4 border-b border-slate-100 pb-6">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-extrabold text-2xl shadow-xs">
              {user?.name?.[0]}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{profile?.name || user?.name}</h2>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{profile?.email || user?.email}</p>
              <span className="inline-block bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-100 uppercase mt-2">
                {profile?.role || 'Student'} Role
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="font-bold text-slate-500 uppercase block mb-1">Student ID</span>
              <span className="font-mono text-slate-900 font-bold text-sm">{profile?.studentId || 'STU2026001'}</span>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="font-bold text-slate-500 uppercase block mb-1">Assigned Section</span>
              <span className="text-slate-900 font-bold text-sm">{profile?.section || 'CSE-A'}</span>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="font-bold text-slate-500 uppercase block mb-1">Academic Year</span>
              <span className="text-slate-900 font-bold text-sm">{profile?.year || '3rd Year'}</span>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="font-bold text-slate-500 uppercase block mb-1">Target Career Goal</span>
              <span className="text-blue-700 font-bold text-sm">{profile?.careerGoal || 'Full Stack Developer'}</span>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
};

export default StudentProfilePage;
