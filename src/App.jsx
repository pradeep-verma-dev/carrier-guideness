import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import HomePage from './pages/HomePage';
import CareerPathsPage from './pages/CareerPathsPage';
import LoginPage from './pages/LoginPage';
import DataExporterPage from './pages/DataExporterPage';

// Student Pages
import StudentDashboard from './pages/StudentDashboard';
import MyRoadmapPage from './pages/MyRoadmapPage';
import MySkillsPage from './pages/MySkillsPage';
import StudentCoursesPage from './pages/StudentCoursesPage';
import StudentCertificationsPage from './pages/StudentCertificationsPage';
import StudentInternshipsPage from './pages/StudentInternshipsPage';
import StudentExamsPage from './pages/StudentExamsPage';
import StudentPlacementPrepPage from './pages/StudentPlacementPrepPage';
import StudentHigherEducationPage from './pages/StudentHigherEducationPage';
import AICareerAssistantPage from './pages/AICareerAssistantPage';
import StudentTalkToTeacherPage from './pages/StudentTalkToTeacherPage';
import StudentProfilePage from './pages/StudentProfilePage';

// Teacher Pages
import TeacherDashboard from './pages/TeacherDashboard';
import TeacherStudentsPage from './pages/TeacherStudentsPage';
import TeacherAnalyticsPage from './pages/TeacherAnalyticsPage';
import TeacherMessagesPage from './pages/TeacherMessagesPage';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminCoursesPage from './pages/AdminCoursesPage';
import AdminCertificationsPage from './pages/AdminCertificationsPage';
import AdminInternshipsPage from './pages/AdminInternshipsPage';
import AdminReportsPage from './pages/AdminReportsPage';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-500">Checking authorization...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/career-paths" element={<CareerPathsPage />} />
          <Route path="/data-export" element={<DataExporterPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Student Protected Routes */}
          <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/roadmap" element={<ProtectedRoute allowedRoles={['student']}><MyRoadmapPage /></ProtectedRoute>} />
          <Route path="/student/skills" element={<ProtectedRoute allowedRoles={['student']}><MySkillsPage /></ProtectedRoute>} />
          <Route path="/student/courses" element={<ProtectedRoute allowedRoles={['student']}><StudentCoursesPage /></ProtectedRoute>} />
          <Route path="/student/certifications" element={<ProtectedRoute allowedRoles={['student']}><StudentCertificationsPage /></ProtectedRoute>} />
          <Route path="/student/internships" element={<ProtectedRoute allowedRoles={['student']}><StudentInternshipsPage /></ProtectedRoute>} />
          <Route path="/student/exams" element={<ProtectedRoute allowedRoles={['student']}><StudentExamsPage /></ProtectedRoute>} />
          <Route path="/student/placement" element={<ProtectedRoute allowedRoles={['student']}><StudentPlacementPrepPage /></ProtectedRoute>} />
          <Route path="/student/higher-ed" element={<ProtectedRoute allowedRoles={['student']}><StudentHigherEducationPage /></ProtectedRoute>} />
          <Route path="/student/ai-assistant" element={<ProtectedRoute allowedRoles={['student']}><AICareerAssistantPage /></ProtectedRoute>} />
          <Route path="/student/teacher-chat" element={<ProtectedRoute allowedRoles={['student']}><StudentTalkToTeacherPage /></ProtectedRoute>} />
          <Route path="/student/progress" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/profile" element={<ProtectedRoute allowedRoles={['student']}><StudentProfilePage /></ProtectedRoute>} />

          {/* Teacher Protected Routes */}
          <Route path="/teacher/dashboard" element={<ProtectedRoute allowedRoles={['teacher', 'admin']}><TeacherDashboard /></ProtectedRoute>} />
          <Route path="/teacher/students" element={<ProtectedRoute allowedRoles={['teacher', 'admin']}><TeacherStudentsPage /></ProtectedRoute>} />
          <Route path="/teacher/analytics" element={<ProtectedRoute allowedRoles={['teacher', 'admin']}><TeacherAnalyticsPage /></ProtectedRoute>} />
          <Route path="/teacher/messages" element={<ProtectedRoute allowedRoles={['teacher', 'admin']}><TeacherMessagesPage /></ProtectedRoute>} />

          {/* Admin Protected Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/students" element={<ProtectedRoute allowedRoles={['admin']}><TeacherStudentsPage /></ProtectedRoute>} />
          <Route path="/admin/teachers" element={<ProtectedRoute allowedRoles={['admin']}><AdminReportsPage /></ProtectedRoute>} />
          <Route path="/admin/courses" element={<ProtectedRoute allowedRoles={['admin']}><AdminCoursesPage /></ProtectedRoute>} />
          <Route path="/admin/certifications" element={<ProtectedRoute allowedRoles={['admin']}><AdminCertificationsPage /></ProtectedRoute>} />
          <Route path="/admin/internships" element={<ProtectedRoute allowedRoles={['admin']}><AdminInternshipsPage /></ProtectedRoute>} />
          <Route path="/admin/exams" element={<ProtectedRoute allowedRoles={['admin']}><AdminCoursesPage /></ProtectedRoute>} />
          <Route path="/admin/placement" element={<ProtectedRoute allowedRoles={['admin']}><AdminCoursesPage /></ProtectedRoute>} />
          <Route path="/admin/higher-ed" element={<ProtectedRoute allowedRoles={['admin']}><AdminCoursesPage /></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['admin']}><AdminReportsPage /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
