import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { getResources, saveAdminResource, deleteAdminResource } from '../services/apiService';
import { exportToCSV } from '../utils/exportUtils';
import { Plus, Edit2, Trash2, Search, Download } from 'lucide-react';

const AdminCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '', platform: 'freeCodeCamp', category: 'Frontend', level: 'Beginner', duration: '30 Hours', skillsStr: '', link: ''
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = () => {
    const data = getResources('courses');
    setCourses(data);
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', platform: 'freeCodeCamp', category: 'Frontend', level: 'Beginner', duration: '30 Hours', skillsStr: '', link: '' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (course) => {
    setEditingId(course.id);
    setFormData({
      name: course.name,
      platform: course.platform,
      category: course.category,
      level: course.level,
      duration: course.duration,
      skillsStr: (course.skills || []).join(', '),
      link: course.link
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this course item?')) return;
    deleteAdminResource('courses', id);
    fetchCourses();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const skills = formData.skillsStr.split(',').map(s => s.trim()).filter(Boolean);
    const payload = { ...formData, skills };
    delete payload.skillsStr;

    saveAdminResource('courses', payload, editingId);
    setIsModalOpen(false);
    fetchCourses();
  };

  const filteredCourses = courses.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row bg-slate-50 min-h-screen">
      <AdminSidebar />

      <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-slate-200">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Catalog Management</span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5">Manage Courses</h1>
            <p className="text-sm text-slate-500 mt-1">
              Add, edit, or delete platform educational course entries.
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex space-x-3">
            <button
              onClick={() => exportToCSV(filteredCourses, 'courses_list.csv')}
              className="inline-flex items-center space-x-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-lg transition"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Course</span>
            </button>
          </div>
        </div>

        {/* SEARCH */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search course title or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Title</th>
                  <th className="py-3.5 px-4">Platform</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Level</th>
                  <th className="py-3.5 px-4">Duration</th>
                  <th className="py-3.5 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCourses.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{c.name}</td>
                    <td className="py-3.5 px-4 text-blue-700 font-semibold">{c.platform}</td>
                    <td className="py-3.5 px-4 text-slate-700">{c.category}</td>
                    <td className="py-3.5 px-4 text-slate-600">{c.level}</td>
                    <td className="py-3.5 px-4 text-slate-600">{c.duration}</td>
                    <td className="py-3.5 px-4 flex items-center space-x-3">
                      <button onClick={() => handleOpenEditModal(c)} className="text-blue-600 hover:text-blue-800">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CRUD MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
              <h3 className="text-lg font-bold text-slate-900">
                {editingId ? 'Edit Course' : 'Add New Course'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Course Name</label>
                  <input
                    type="text" required
                    value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Platform</label>
                    <input
                      type="text" required
                      value={formData.platform} onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Category</label>
                    <input
                      type="text" required
                      value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Level</label>
                    <select
                      value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Duration</label>
                    <input
                      type="text" required
                      value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Skills (Comma separated)</label>
                  <input
                    type="text" required
                    placeholder="HTML, CSS, JavaScript"
                    value={formData.skillsStr} onChange={(e) => setFormData({ ...formData, skillsStr: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Course URL Link</label>
                  <input
                    type="url" required
                    value={formData.link} onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div className="pt-3 flex justify-end space-x-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold">Save Course</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminCoursesPage;
