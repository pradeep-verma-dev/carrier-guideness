import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Mail, ShieldCheck, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2 text-white">
              <Compass className="w-6 h-6 text-blue-400" />
              <span className="font-bold text-lg">Career Roadmap Portal</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Intelligent Career Planning and Guidance System designed for student success and mentor advisory.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-blue-400 transition">Home</Link></li>
              <li><Link to="/career-paths" className="hover:text-blue-400 transition">Explore Career Paths</Link></li>
              <li><Link to="/login" className="hover:text-blue-400 transition">Student Login</Link></li>
              <li><Link to="/login" className="hover:text-blue-400 transition">Faculty Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Resource Hubs</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="hover:text-blue-400 cursor-pointer">Skill Gap Analysis</span></li>
              <li><span className="hover:text-blue-400 cursor-pointer">Placement Preparation</span></li>
              <li><span className="hover:text-blue-400 cursor-pointer">Competitive Examinations</span></li>
              <li><span className="hover:text-blue-400 cursor-pointer">Higher Education Guidance</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Institution Access</h4>
            <p className="text-xs text-slate-400 mb-3">
              Designed for college department integration, mentor tracking, and admin dashboard reporting.
            </p>
            <div className="inline-flex items-center space-x-2 text-xs bg-slate-800 text-blue-400 px-3 py-1.5 rounded-md border border-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Role-Based Secure JWT</span>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Career Roadmap Portal. College EdTech Demonstration Platform.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Documentation</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
