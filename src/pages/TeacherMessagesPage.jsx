import React, { useState, useEffect } from 'react';
import TeacherSidebar from '../components/TeacherSidebar';
import { useAuth } from '../context/AuthContext';
import { replyTeacherMessage } from '../services/apiService';
import { getStorageData, STORAGE_KEYS } from '../services/storageService';
import { Send } from 'lucide-react';

const TeacherMessagesPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [replyTextMap, setReplyTextMap] = useState({});
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = () => {
    const data = getStorageData(STORAGE_KEYS.MESSAGES);
    setMessages(data);
  };

  const handleSendReply = (msgId) => {
    const replyContent = replyTextMap[msgId];
    if (!replyContent || !replyContent.trim()) {
      alert('Reply content cannot be empty.');
      return;
    }

    replyTeacherMessage(msgId, replyContent, user?.name || 'Faculty Advisor');
    setReplyTextMap({ ...replyTextMap, [msgId]: '' });
    fetchMessages();
  };

  const filteredMessages = messages.filter(m => {
    if (activeFilter === 'Pending') return m.status === 'Pending';
    if (activeFilter === 'Resolved') return m.status === 'Resolved';
    return true;
  });

  return (
    <div className="flex flex-col lg:flex-row bg-slate-50 min-h-screen">
      <TeacherSidebar />

      <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-slate-200">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Student Guidance Advisory</span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5">Student Queries & Messages</h1>
            <p className="text-sm text-slate-500 mt-1">
              Review and respond to career, higher ed, placement, and skill guidance inquiries.
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex space-x-2">
            {['All', 'Pending', 'Resolved'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeFilter === filter
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-white hover:bg-slate-50 border border-slate-300 text-slate-700'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* MESSAGES LIST */}
        {filteredMessages.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500 text-xs">
            No student queries found for this filter.
          </div>
        ) : (
          <div className="space-y-6">
            {filteredMessages.map((msg) => {
              const isResolved = msg.status === 'Resolved';
              return (
                <div key={msg.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
                  
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-3">
                      <div className="w-9 h-9 bg-blue-100 text-blue-700 font-bold rounded-lg flex items-center justify-center shrink-0 text-xs">
                        {msg.studentName?.[0] || 'S'}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-base font-bold text-slate-900">{msg.studentName}</h4>
                          <span className="text-xs text-slate-500 font-mono">({msg.section})</span>
                          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                            {msg.category}
                          </span>
                        </div>
                        <h5 className="text-sm font-semibold text-slate-800 mt-1">{msg.subject}</h5>
                        <span className="text-[11px] text-slate-400 font-mono">{msg.date}</span>
                      </div>
                    </div>

                    <span className={`text-xs font-semibold px-2.5 py-1 rounded ${
                      isResolved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {msg.status}
                    </span>
                  </div>

                  {/* Student Question Text */}
                  <p className="text-slate-700 text-xs bg-slate-50 p-4 rounded-lg border border-slate-100 leading-relaxed">
                    "{msg.message}"
                  </p>

                  {/* Existing Reply */}
                  {msg.reply && (
                    <div className="bg-blue-50/60 border border-blue-100 p-4 rounded-lg">
                      <div className="flex justify-between items-center text-xs font-bold text-blue-900 mb-1">
                        <span>Faculty Advisory Reply ({msg.teacherName || user.name}):</span>
                        <span className="text-[10px] text-slate-400">{msg.repliedAt}</span>
                      </div>
                      <p className="text-xs text-slate-800 leading-relaxed">{msg.reply}</p>
                    </div>
                  )}

                  {/* Reply Input Box */}
                  {!isResolved && (
                    <div className="pt-2 border-t border-slate-100 flex items-center space-x-3">
                      <input
                        type="text"
                        placeholder="Type faculty response..."
                        value={replyTextMap[msg.id] || ''}
                        onChange={(e) => setReplyTextMap({ ...replyTextMap, [msg.id]: e.target.value })}
                        className="flex-grow px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => handleSendReply(msg.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-2xs transition flex items-center space-x-1.5 shrink-0"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Reply</span>
                      </button>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </main>
    </div>
  );
};

export default TeacherMessagesPage;
