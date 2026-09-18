import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { loginUser } from '../services/apiService';
import { LogIn, User, Lock, AlertCircle, ArrowRight } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = (emailToUse, passwordToUse) => {
    setError('');
    setLoading(true);

    try {
      const { user, token } = loginUser(emailToUse, passwordToUse);
      login(user, token);

      if (user.role === 'student') navigate('/student/dashboard');
      else if (user.role === 'teacher') navigate('/teacher/dashboard');
      else if (user.role === 'admin') navigate('/admin/dashboard');
      else navigate('/');

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLoginSubmit(email, password);
  };

  const handleDemoLogin = (demoRole) => {
    if (demoRole === 'student') {
      setEmail('student1@careerportal.demo');
      setPassword('student123');
      handleLoginSubmit('student1@careerportal.demo', 'student123');
    } else if (demoRole === 'teacher') {
      setEmail('teacher@careerportal.demo');
      setPassword('teacher123');
      handleLoginSubmit('teacher@careerportal.demo', 'teacher123');
    } else if (demoRole === 'admin') {
      setEmail('admin@careerportal.demo');
      setPassword('admin123');
      handleLoginSubmit('admin@careerportal.demo', 'admin123');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
          
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl mx-auto flex items-center justify-center mb-3">
              <LogIn className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">Portal Login</h2>
            <p className="text-sm text-slate-500 mt-1">
              Access your personalized roadmap, mentor queries, or portal analytics.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <User className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@careerportal.demo"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg text-sm transition shadow-2xs flex items-center justify-center space-x-2"
            >
              <span>Login</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Credentials Buttons */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center mb-3">
              One-Click Demo Login Options
            </h4>
            
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('student')}
                className="w-full bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-medium py-2 px-4 rounded-lg text-xs border border-slate-200 transition flex items-center justify-between"
              >
                <span>Continue as Demo Student</span>
                <span className="text-slate-400 font-mono text-[10px]">student1@careerportal.demo</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('teacher')}
                className="w-full bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-medium py-2 px-4 rounded-lg text-xs border border-slate-200 transition flex items-center justify-between"
              >
                <span>Continue as Demo Teacher</span>
                <span className="text-slate-400 font-mono text-[10px]">teacher@careerportal.demo</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="w-full bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-medium py-2 px-4 rounded-lg text-xs border border-slate-200 transition flex items-center justify-between"
              >
                <span>Continue as Demo Admin</span>
                <span className="text-slate-400 font-mono text-[10px]">admin@careerportal.demo</span>
              </button>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
