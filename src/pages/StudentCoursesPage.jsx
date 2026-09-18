import React, { useState, useEffect } from 'react';
import StudentSidebar from '../components/StudentSidebar';
import { getResources } from '../services/apiService';
import { BookOpen, ExternalLink, Clock, Search } from 'lucide-react';

const StudentCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [completedIds, setCompletedIds] = useState(['c1', 'c2']);

  useEffect(() => {
    const data = getResources('courses');
    setCourses(data);
  }, []);

  const toggleComplete = (id) => {
    if (completedIds.includes(id)) {
      setCompletedIds(completedIds.filter(cId => cId !== id));
    } else {
      setCompletedIds([...completedIds, id]);
    }
  };

  const categories = ['All', ...new Set(courses.map(c => c.category))];

  const filteredCourses = courses.filter(c => {
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <StudentSidebar />

      <main className="flex-grow p-8 overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-slate-200">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Educational Resources</span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5">Explore Courses</h1>
            <p className="text-sm text-slate-500 mt-1">
              Curated course catalog from freeCodeCamp, NPTEL, Coursera, edX, and Udemy.
            </p>
          </div>

          <div className="mt-4 md:mt-0 text-xs text-slate-600 bg-white px-3 py-2 border border-slate-200 rounded-lg">
            Completed: <strong>{completedIds.length}</strong> / {courses.length}
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search course title, platform, or skill..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 font-medium focus:outline-none"
          >
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* COURSE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const isDone = completedIds.includes(course.id);
            return (
              <div key={course.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs hover:border-blue-300 transition flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      {course.platform}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">{course.level}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2">{course.name}</h3>

                  <div className="flex items-center space-x-2 text-xs text-slate-500 mb-4">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{course.duration}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-6">
                    {course.skills?.map((s, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <a
                    href={course.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    <span>View Course</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => toggleComplete(course.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      isDone
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {isDone ? 'Mark Completed' : 'Start'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </main>
    </div>
  );
};

export default StudentCoursesPage;
