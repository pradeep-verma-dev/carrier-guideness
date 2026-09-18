import React, { useState, useEffect } from 'react';
import StudentSidebar from '../components/StudentSidebar';
import { useAuth } from '../context/AuthContext';
import { getStudentProfile } from '../services/apiService';
import { exportToJSON, exportToCSV } from '../utils/exportUtils';
import { 
  Target, Award, BookOpen, Briefcase, CheckCircle2, Download, 
  ArrowUpRight, AlertCircle, Sparkles, TrendingUp
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const data = getStudentProfile(user.id);
      setProfile(data);
    }
    setLoading(false);
  }, [user]);

  const handleDownloadCareerReport = (format = 'json') => {
    if (!profile) return;
    const reportData = {
      generatedAt: new Date().toISOString(),
      student: {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        studentId: profile.studentId,
        section: profile.section,
        year: profile.year,
        careerGoal: profile.careerGoal
      },
      careerReadiness: profile.readiness,
      skills: profile.skills || [],
      skillGaps: profile.skillGaps || [],
      coursesCompleted: profile.completedCoursesCount || 0,
      certificationsCompleted: profile.certificationsCount || 0,
      internshipsApplied: profile.internshipsAppliedCount || 0,
      placementPreparation: profile.placementPrepProgress || 0
    };

    if (format === 'json') {
      exportToJSON(reportData, `student_career_report_${user.name.replace(/\s+/g, '_')}.json`);
    } else {
      const csvRows = [
        { Section: 'Student Info', Metric: 'Name', Value: reportData.student.name },
        { Section: 'Student Info', Metric: 'Student ID', Value: reportData.student.studentId },
        { Section: 'Student Info', Metric: 'Career Goal', Value: reportData.student.careerGoal },
        { Section: 'Performance', Metric: 'Career Readiness Score', Value: `${reportData.careerReadiness}%` },
        { Section: 'Performance', Metric: 'Courses Completed', Value: reportData.coursesCompleted },
        { Section: 'Performance', Metric: 'Certifications Completed', Value: reportData.certificationsCompleted },
        { Section: 'Performance', Metric: 'Internship Applications', Value: reportData.internshipsApplied },
        { Section: 'Performance', Metric: 'Placement Prep Progress', Value: `${reportData.placementPreparation}%` },
        { Section: 'Skill Gaps', Metric: 'Identified Focus Gaps', Value: reportData.skillGaps.join('; ') }
      ];
      exportToCSV(csvRows, `student_career_report_${user.name.replace(/\s+/g, '_')}.csv`);
    }
  };

  if (loading) {
    return (
      <div className="flex bg-slate-50 min-h-screen">
        <StudentSidebar />
        <div className="flex-grow flex items-center justify-center text-slate-500 text-sm">
          Loading student dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <StudentSidebar />

      <main className="flex-grow p-8 overflow-y-auto">
        
        {/* Top Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-slate-200">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Student Overview</span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5">Welcome back, {user?.name}!</h1>
            <p className="text-sm text-slate-500 mt-1">
              Target Career Goal: <strong className="text-blue-700">{profile?.careerGoal || 'Full Stack Developer'}</strong>
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex space-x-3">
            <button
              onClick={() => handleDownloadCareerReport('json')}
              className="inline-flex items-center space-x-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold px-4 py-2 rounded-lg transition shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Download Report (JSON)</span>
            </button>
            <button
              onClick={() => handleDownloadCareerReport('csv')}
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Report (CSV)</span>
            </button>
          </div>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
          
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Career Readiness</span>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900 mb-2">{profile?.readiness || 68}%</div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                style={{ width: `${profile?.readiness || 68}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Skills Mastered</span>
              <Target className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900 mb-1">
              {profile?.skills?.length || 8} <span className="text-sm font-semibold text-slate-400">/ 12</span>
            </div>
            <p className="text-xs text-slate-500">In target roadmap track</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Courses</span>
              <BookOpen className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900 mb-1">{profile?.completedCoursesCount || 5}</div>
            <p className="text-xs text-emerald-600 font-medium">Completed modules</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Certifications</span>
              <Award className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900 mb-1">{profile?.certificationsCount || 3}</div>
            <p className="text-xs text-slate-500">Verified credentials</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Placement Prep</span>
              <Briefcase className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900 mb-2">{profile?.placementPrepProgress || 55}%</div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${profile?.placementPrepProgress || 55}%` }}
              ></div>
            </div>
          </div>

        </div>

        {/* RECENT SKILL GAPS & ACTION RECOMMENDATION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <Target className="w-5 h-5 text-blue-600" />
              <span>Current Skill Proficiencies & Gaps</span>
            </h3>

            <div className="space-y-4">
              {profile?.skills?.slice(0, 5).map((skill, idx) => (
                <div key={idx} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-semibold text-slate-800">{skill.name}</span>
                    <span className="text-slate-500">{skill.level} ({skill.progress}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-blue-600 h-full rounded-full" 
                      style={{ width: `${skill.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center space-x-2 text-blue-800 font-bold mb-3">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span>Focus Next (Skill Gap Alert)</span>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Based on your career target (<strong>{profile?.careerGoal}</strong>), prioritize resolving the following identified skill gaps:
            </p>

            <div className="space-y-2 mb-6">
              {profile?.skillGaps?.map((gap, gIdx) => (
                <div key={gIdx} className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border border-blue-100 text-xs font-semibold text-slate-800 shadow-2xs">
                  <AlertCircle className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{gap}</span>
                </div>
              ))}
            </div>

            <a
              href="/student/courses"
              className="w-full inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 rounded-lg transition"
            >
              <span>Explore Recommended Courses</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

        </div>

      </main>
    </div>
  );
};

export default StudentDashboard;
