import React, { useState, useEffect } from 'react';
import StudentSidebar from '../components/StudentSidebar';
import { useAuth } from '../context/AuthContext';
import { submitStudentMessage } from '../services/apiService';
import { getStorageData, STORAGE_KEYS } from '../services/storageService';
import { MessageSquare, Send, CheckCircle2 } from 'lucide-react';

const CATEGORIES = [
  "Career Choice",
  "Skill Guidance",
  "Roadmap",
  "Placement",
  "Higher Education",
  "Internship",
  "Other"
];

const StudentTalkToTeacherPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Career Choice');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, [user]);

  const fetchMessages = () => {
    if (!user) return;
    const all = getStorageData(STORAGE_KEYS.MESSAGES);
    const studentMsgs = all.filter(m => m.studentId === user.id);
    setMessages(studentMsgs);
  };

  const handleSubmitQuery = (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim() || !user) return;

    setSubmitting(true);
    try {
      submitStudentMessage(user.id, subject, category, message);
      setSubject('');
      setMessage('');
      fetchMessages();
    } catch (err) {
      alert('Failed to submit query to faculty mentor');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row bg-slate-50 min-h-screen">
      <StudentSidebar />

      <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-slate-200">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Faculty Advisory</span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5">Talk to Faculty Mentor</h1>
            <p className="text-sm text-slate-500 mt-1">
              Submit formal queries directly to department teachers and advisors.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Query Submission Form */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs self-start">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <span>Ask Faculty Mentor</span>
            </h3>

            <form onSubmit={handleSubmitQuery} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="Brief summary of query..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {CATEGORIES.map((cat, idx) => (
                    <option key={idx} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Message Detail</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Describe your guidance requirements in detail..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-xs transition shadow-2xs flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Submitting...' : 'Send Message'}</span>
              </button>
            </form>
          </div>

          {/* Submitted Queries & Answers List */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-base font-bold text-slate-900 mb-2">My Submitted Guidance Queries</h3>

            {messages.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500 text-xs">
                No queries submitted yet.
              </div>
            ) : (
              messages.map((q) => {
                const isResolved = q.status === 'Resolved';
                return (
                  <div key={q.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                          {q.category}
                        </span>
                        <h4 className="text-base font-bold text-slate-900 mt-1">{q.subject}</h4>
                        <span className="text-[11px] text-slate-400 font-mono">Date: {q.date}</span>
                      </div>

                      <span className={`text-xs font-semibold px-2.5 py-1 rounded ${
                        isResolved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {q.status}
                      </span>
                    </div>

                    <p className="text-slate-700 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed">
                      "{q.message}"
                    </p>

                    {/* Teacher Reply if available */}
                    {q.reply && (
                      <div className="mt-3 pt-3 border-t border-slate-100 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold text-blue-900">Faculty Reply ({q.teacherName || 'Faculty Advisor'}):</span>
                          <span className="text-[10px] text-slate-400">{q.repliedAt}</span>
                        </div>
                        <p className="text-xs text-slate-800 leading-relaxed">{q.reply}</p>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

        </div>

      </main>
    </div>
  );
};

export default StudentTalkToTeacherPage;
