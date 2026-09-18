import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { useAuth } from '../context/AuthContext';
import { exportToCSV } from '../utils/exportUtils';
import { Plus, Edit2, Trash2, Search, Download } from 'lucide-react';

const AdminInternshipsPage = () => {
  const { token } = useAuth();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    company: '', role: '', location: 'Remote', mode: 'Remote', duration: '3 Months', skillsStr: '', deadline: '2026-11-30'
  });

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      const response = await fetch('/api/admin/internships', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setInternships(data);
    } catch (err) {
      console.error('Error fetching internships:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({ company: '', role: '', location: 'Remote', mode: 'Remote', duration: '3 Months', skillsStr: '', deadline: '2026-11-30' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingId(item.id);
    setFormData({
      company: item.company,
      role: item.role,
      location: item.location,
      mode: item.mode,
      duration: item.duration,
      skillsStr: (item.requiredSkills || []).join(', '),
      deadline: item.deadline
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete internship listing?')) return;
    try {
      const response = await fetch(`/api/admin/internships/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) fetchInternships();
    } catch (err) {
      alert('Failed to delete internship');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredSkills = formData.skillsStr.split(',').map(s => s.trim()).filter(Boolean);
    const payload = { ...formData, requiredSkills, isDemo: true };
    delete payload.skillsStr;

    try {
      let url = '/api/admin/internships';
      let method = 'POST';
      if (editingId) {
        url = `/api/admin/internships/${editingId}`;
        method = 'PUT';
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setIsModalOpen(false);
        fetchInternships();
      }
    } catch (err) {
      alert('Failed to save internship record');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row bg-slate-50 min-h-screen">
      <AdminSidebar />

      <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto">
        
        <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-200">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Demo Opportunities</span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5">Manage Internships</h1>
          </div>

          <div className="flex space-x-3">
            <button onClick={() => exportToCSV(internships, 'internships.csv')} className="bg-white border px-4 py-2 text-xs font-semibold rounded-lg flex items-center space-x-2">
              <Download className="w-3.5 h-3.5 text-blue-600" /><span>Export CSV</span>
            </button>
            <button onClick={handleOpenAddModal} className="bg-blue-600 text-white px-4 py-2 text-xs font-bold rounded-lg flex items-center space-x-2">
              <Plus className="w-4 h-4" /><span>Add Internship</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500 text-sm">Loading internships...</div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b text-slate-500 font-bold uppercase">
                  <th className="py-3.5 px-4">Company</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Mode</th>
                  <th className="py-3.5 px-4">Duration</th>
                  <th className="py-3.5 px-4">Deadline</th>
                  <th className="py-3.5 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {internships.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{item.company}</td>
                    <td className="py-3.5 px-4 text-blue-700 font-semibold">{item.role}</td>
                    <td className="py-3.5 px-4">{item.mode}</td>
                    <td className="py-3.5 px-4">{item.duration}</td>
                    <td className="py-3.5 px-4">{item.deadline}</td>
                    <td className="py-3.5 px-4 flex items-center space-x-3">
                      <button onClick={() => handleOpenEditModal(item)} className="text-blue-600"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(item.id)} className="text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-3 text-xs">
              <h3 className="text-base font-bold">{editingId ? 'Edit Internship' : 'Add Internship'}</h3>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input type="text" placeholder="Company Name" required value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} className="w-full p-2 border rounded-lg" />
                <input type="text" placeholder="Role Title" required value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="w-full p-2 border rounded-lg" />
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" placeholder="Location" required value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="p-2 border rounded-lg" />
                  <input type="text" placeholder="Mode (Remote/On-Site)" required value={formData.mode} onChange={e => setFormData({ ...formData, mode: e.target.value })} className="p-2 border rounded-lg" />
                </div>
                <input type="text" placeholder="Required Skills (Comma separated)" required value={formData.skillsStr} onChange={e => setFormData({ ...formData, skillsStr: e.target.value })} className="w-full p-2 border rounded-lg" />
                <div className="flex justify-end space-x-2 pt-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold">Save</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminInternshipsPage;
