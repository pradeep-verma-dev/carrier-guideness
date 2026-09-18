import React, { useState, useEffect, useRef } from 'react';
import StudentSidebar from '../components/StudentSidebar';
import { useAuth } from '../context/AuthContext';
import { processAIChat } from '../services/apiService';
import { getStorageData, setStorageData, STORAGE_KEYS } from '../services/storageService';
import { Bot, Send, Plus, Trash2, Sparkles, User, MessageSquare } from 'lucide-react';

const COMMON_QUESTIONS = [
  "What career should I choose after B.Tech?",
  "What skills do I need for Full Stack Development?",
  "Create a roadmap for AI/ML.",
  "How should I prepare for placements?",
  "What certifications should I complete?",
  "How can I improve my resume?",
  "What should I learn next?",
  "Should I focus on DSA or development?"
];

const AICareerAssistantPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const fetchHistory = () => {
    if (!user) return;
    const history = getStorageData(STORAGE_KEYS.CHAT_HISTORY);
    const userChats = history.filter(c => c.userId === user.id);
    setChatHistory(userChats);
  };

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || !user) return;

    const userMsg = { role: 'user', content: query, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await processAIChat(user.id, query, currentChatId);
      setMessages(res.chat.messages);
      setCurrentChatId(res.chatId);
      fetchHistory();
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Apologies, I encountered an issue generating AI career advice. Please try again.',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChat = (chatId) => {
    setCurrentChatId(chatId);
    const history = getStorageData(STORAGE_KEYS.CHAT_HISTORY);
    const selected = history.find(c => c.chatId === chatId && c.userId === user.id);
    if (selected) {
      setMessages(selected.messages);
    }
  };

  const handleNewChat = () => {
    setCurrentChatId(null);
    setMessages([]);
  };

  const handleDeleteChat = (chatId, e) => {
    e.stopPropagation();
    const history = getStorageData(STORAGE_KEYS.CHAT_HISTORY);
    const filtered = history.filter(c => !(c.chatId === chatId && c.userId === user.id));
    setStorageData(STORAGE_KEYS.CHAT_HISTORY, filtered);
    if (currentChatId === chatId) handleNewChat();
    fetchHistory();
  };

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <StudentSidebar />

      <main className="flex-grow flex flex-col h-screen overflow-hidden">
        
        {/* Top Chat Bar */}
        <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-xs">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">AI CAREER ASSISTANT</h1>
              <p className="text-xs text-slate-500">Your personal educational & career planning assistant</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleNewChat}
              className="inline-flex items-center space-x-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-2 rounded-lg transition border border-blue-200"
            >
              <Plus className="w-4 h-4" />
              <span>New Chat</span>
            </button>
          </div>
        </div>

        {/* CHAT CONTAINER HAS CHAT SIDEBAR + MESSAGES MAIN */}
        <div className="flex-grow flex overflow-hidden">
          
          {/* History Sidebar */}
          <div className="w-64 bg-white border-r border-slate-200 p-4 hidden md:flex flex-col shrink-0 overflow-y-auto">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Conversation History</h3>

            {chatHistory.length === 0 ? (
              <div className="text-xs text-slate-400 text-center py-6">No previous conversations</div>
            ) : (
              <div className="space-y-1">
                {chatHistory.map(chat => (
                  <div
                    key={chat.chatId}
                    onClick={() => handleSelectChat(chat.chatId)}
                    className={`group flex items-center justify-between p-2.5 rounded-lg text-xs font-medium cursor-pointer transition ${
                      currentChatId === chat.chatId ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{chat.title}</span>
                    </div>

                    <button
                      onClick={(e) => handleDeleteChat(chat.chatId, e)}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-600 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Chat Messages Area */}
          <div className="flex-grow flex flex-col bg-slate-50 overflow-hidden">
            
            <div className="flex-grow p-6 overflow-y-auto space-y-4">
              
              {/* If Empty Screen: Display Common Prompts */}
              {messages.length === 0 && (
                <div className="max-w-2xl mx-auto my-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs">
                  <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl mx-auto flex items-center justify-center mb-3">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">COMMON QUESTIONS</h3>
                    <p className="text-xs text-slate-500 mt-1">Select any prompt below to ask your AI Career Assistant immediately:</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {COMMON_QUESTIONS.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(q)}
                        className="p-3 text-left bg-slate-50 hover:bg-blue-50 hover:border-blue-300 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 hover:text-blue-800 transition"
                      >
                        "{q}"
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Message List */}
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex items-start space-x-3 max-w-3xl ${
                    msg.role === 'user' ? 'ml-auto flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    msg.role === 'user' ? 'bg-slate-800 text-white' : 'bg-blue-600 text-white'
                  }`}>
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div className={`p-4 rounded-2xl text-xs leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-white border border-slate-200 text-slate-900 rounded-tl-none shadow-2xs whitespace-pre-line'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-center space-x-3 max-w-3xl">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="p-4 bg-white border border-slate-200 text-slate-500 text-xs rounded-2xl rounded-tl-none shadow-2xs">
                    Generating response...
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-4 bg-white border-t border-slate-200 shrink-0">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                className="max-w-4xl mx-auto flex items-center space-x-3"
              >
                <input
                  type="text"
                  placeholder="Ask anything about your career..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-grow px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                  type="submit"
                  disabled={loading || !inputMessage.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white p-3 rounded-xl transition shadow-2xs"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
};

export default AICareerAssistantPage;
